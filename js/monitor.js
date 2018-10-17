'use strict';

/*
 * From the Concept2 Performance Monitor Bluetooth Smart Communications
 * Interface Definition spec, v1.25, 8/29/17 11:19AM.
 *
 * Verify discovered services:
 * - https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html
 *
 * Inspired from https://github.com/GoogleChromeLabs/rowing-monitor
 */
const services = {
    discovery:      { id: 'ce060000-43e5-11e4-916c-0800200c9a66' },
    information:    { id: 'ce060010-43e5-11e4-916c-0800200c9a66' },
    control:        { id: 'ce060020-43e5-11e4-916c-0800200c9a66' },
    rowing:         { id: 'ce060030-43e5-11e4-916c-0800200c9a66' }
};
const characteristics = {
    informationService: {
        modelNumber: {
            id:         'ce060011-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        },
        serialNumber: {
            id:         'ce060012-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        },
        hardwareRevision: {
            id:         'ce060013-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        },
        firmwareRevision: {
            id:         'ce060014-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        },
        manufacturerName: {
            id:         'ce060015-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        },
        machineType: {
            id:         'ce060016-43e5-11e4-916c-0800200c9a66',
            service:    services.information
        }
    },
    controlService: {
        transmit: {
            id:         'ce060021-43e5-11e4-916c-0800200c9a66',
            service:    services.control
        },
        receive: {
            id:         'ce060022-43e5-11e4-916c-0800200c9a66',
            service:    services.control
        }
    },
    rowingService: {
        generalStatus: {
            id:         'ce060031-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalStatus: {
            id:         'ce060032-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalStatus2: {
            id:         'ce060033-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        generalStatusRate: {
            id:         'ce060034-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        strokeData: {
            id:         'ce060035-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalStrokeData: {
            id:         'ce060036-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        splitIntervalData: {
            id:         'ce060037-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalSplitIntervalData: {
            id:         'ce060038-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        endOfWorkoutSummaryData: {
            id:         'ce060039-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalEndOfWorkoutSummaryData: {
            id:         'ce06003a-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        heartRateBeltInformation: {
            id:         'ce06003b-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        additionalEndOfWorkoutSummaryData2: {
            id:         'ce06003c-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        forceCurveData: {
            id:         'ce06003d-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        },
        multiplexedInformation: {
            id:         'ce060080-43e5-11e4-916c-0800200c9a66',
            service:    services.rowing
        }
    }
};

const printables = {
    empty: function(v) {
        return v;
    },
    ms2hms: function(msecs) {
        return new Date(msecs).toISOString().substr(11, 8);
    },
    secs2hms: function(secs) {
        return new Date(secs * 1000).toISOString().substr(11, 11);
    },
    metres: function(m) {
        return m.toLocaleString() + 'm';
    },
    workoutType: function(wtype) {
        switch (wtype) {
            case 0: return 'Just row, no splits'; break;
            case 1: return 'Just row, splits'; break;
            case 2: return 'Fixed dist, no splits'; break;
            case 3: return 'Fixed dist, splits'; break;
            case 4: return 'Fixed time, no splits'; break;
            case 5: return 'Fixed time, splits'; break;
            case 6: return 'Fixed time, interval'; break;
            case 7: return 'Fixed dist, interval'; break;
            case 8: return 'Variable, interval'; break;
            case 9: return 'Variable, undef rest, interval'; break;
            case 10: return 'Fixed, calorie'; break;
            case 11: return 'Fixed, watt-minutes'; break;
            case 12: return 'Fixed cals, interval'; break;
            default:
                break;
        }
        return 'unknown';
    },
    intervalType: function(itype) {
        switch (itype) {
            case 0: return 'Time'; break;
            case 1: return 'Distance'; break;
            case 2: return 'Rest'; break;
            case 3: return 'Time, rest undefined'; break;
            case 4: return 'Distance, rest undefined'; break;
            case 5: return 'Rest, undefined'; break;
            case 6: return 'Calorie'; break;
            case 7: return 'Calorie, rest undefined'; break;
            case 8: return 'Watt-minute'; break;
            case 9: return 'Watt-minute, rest undefined'; break;
            case 255: return 'None';
            default:
                break;
        }
        return 'unknown';
    },
    workoutState: function(wstate) {
        switch (wstate) {
            case 0: return 'Wait To Begin'; break;
            case 1: return 'Workout Row'; break;
            case 2: return 'Countdown Pause'; break;
            case 3: return 'Interval Rest'; break;
            case 4: return 'Interval Work Time'; break;
            case 5: return 'Interval Work Distance'; break;
            case 6: return 'Interval Rest End To Work Time'; break;
            case 7: return 'Interval Rest End To Work Distance'; break;
            case 8: return 'Interval Work Time To Rest'; break;
            case 9: return 'Interval Work Distance To Rest'; break;
            case 10: return 'Workout End'; break;
            case 11: return 'Terminate'; break;
            case 12: return 'Workout Logged'; break;
            case 13: return 'Rearm'; break;
            default:
                break;
        }
        return 'unknown';
    },
    rowingState: function(rstate) {
        switch (rstate) {
            case 0: return 'Inactive'; break;
            case 1: return 'Active'; break;
            default:
                break;
        }
        return 'unknown';
    },
    strokeState: function(sstate) {
        switch (sstate) {
            case 0: return 'Waiting To Reach Min Speed'; break;
            case 1: return 'Waiting To Accelerate'; break;
            case 2: return 'Driving'; break;
            case 3: return 'Dwelling After Drive'; break;
            case 4: return 'Recovery'; break;
            default:
                break;
        }
        return 'unknown';
    },
    workoutDuration: function(wduration) {
        /* XXX Figure out how to handle this one */
        /*
         * enum DurationTypes {
         *      CSAFE_TIME_DURATION = 0,
         *      CSAFE_CALORIES_DURATION = 0x40,
         *      CSAFE_DISTANCE_DURATION = 0x80,
         *      CSAFE_WATTS_DURATION = 0xc0
         * }
         */
        /*
        if (data.workoutDurationType == 0x0) {
            data.workoutDuration *= 0.01;
        }
        */
        return wduration;
    },
    workoutDurationType: function(wdurationtype) {
        switch (wdurationtype) {
            case 0: return 'Time'; break;
            case 0x40: return 'Calories'; break;
            case 0x80: return 'Distance'; break;
            case 0xc0: return 'Watts'; break;
            default:
                break;
        }
        return 'unknown';
    },
    as_is: function(n) {
        return n;
    },
    fixed: function(n) {
        return n.toFixed(2);
    },
    m_per_second: function(n) {
        return n.toFixed(2) + "m/s";
    },
    heartRate: function(n) {
        return n == 255 ? 'N/A' : n;
    },
    watts: function(n) {
        return n.toFixed(2).toLocaleString() + 'W';
    },
    calories: function(n) {
        return n.toLocaleString() + 'cals';
    },
    metres_fixed: function(n) {
        return n.toFixed(2).toLocaleString() + 'm';
    },
    splitIntervalType: function(n) {
        return n;
    }
};

const fields = {
    elapsedTime: {
        label: 'Elapsed Time',
        printable: printables['secs2hms']
    },
    distance: {
        label: 'Distance',
        printable: printables['metres'],
    },
    workoutType: {
        label: 'Workout Type',
        printable: printables['workoutType'],
    },
    intervalType: {
        label: 'Interval Type',
        printable: printables['intervalType'],
    },
    workoutState: {
        label: 'Workout State',
        printable: printables['workoutState'],
    },
    rowingState: {
        label: 'Rowing State',
        printable: printables['rowingState'],
    },
    strokeState: {
        label: 'Stroke State',
        printable: printables['strokeState'],
    },
    totalWorkDistance: {
        label: 'Total Work Distance',
        printable: printables['metres'],
    },
    workoutDuration: {
        label: 'Workout Duration',
        printable: printables['workoutDuration'],
    },
    workoutDurationType: {
        label: 'Workout Duration Type',
        printable: printables['workoutDurationType'],
    },
    dragFactor: {
        label: 'Drag Factor',
        printable: printables['as_is'],
    },
    speed: {
        label: 'Speed',
        printable: printables['m_per_second'],
    },
    strokeRate: {
        label: 'Stroke Rate',
        printable: printables['as_is'],
    },
    heartRate: {
        label: 'Heart Rate',
        printable: printables['heartRate'],
    },
    currentPace: {
        label: 'Current Pace',
        printable: printables['secs2hms'],
    },
    averagePace: {
        label: 'Average Pace',
        printable: printables['secs2hms'],
    },
    restDistance: {
        label: 'Rest Distance',
        printable: printables['metres'],
    },
    restTime: {
        label: 'Rest Time',
        printable: printables['secs2hms'],
    },
    intervalCount: {
        label: 'Interval Count',
        printable: printables['as_is'],
    },
    averagePower: {
        label: 'Average Power',
        printable: printables['watts'],
    },
    totalCalories: {
        label: 'Total Calories',
        printable: printables['calories'],
    },
    splitAveragePace: {
        label: 'Split Average Pace',
        printable: printables['secs2hms'],
    },
    splitAveragePower: {
        label: 'Split Average Power',
        printable: printables['watts'],
    },
    splitAverageCalories: {
        label: 'Split Average Calories',
        printable: printables['calories'],
    },
    lastSplitTime: {
        label: 'Last Split Time',
        printable: printables['secs2hms'],
    },
    lastSplitDistance: {
        label: 'Last Split Distance',
        printable: printables['metres'],
    },
    driveLength: {
        label: 'Drive Length',
        printable: printables['metres_fixed'],
    },
    driveTime: {
        label: 'Drive Time',
        printable: printables['secs2hms'],
    },
    strokeRecoveryTime: {
        label: 'Stroke Recovery Time',
        printable: printables['secs2hms'],
    },
    strokeDistance: {
        label: 'Stroke Distance',
        printable: printables['metres_fixed'],
    },
    peakDriveForce: {
        label: 'Peak Drive Force',
        printable: printables['watts'],
    },
    averageDriveForce: {
        label: 'Average Drive Force',
        printable: printables['empty'],
    },
    workPerStroke: {
        label: 'Work Per Stroke',
        printable: printables['empty'],
    },
    strokeCount: {
        label: 'Stroke Count',
        printable: printables['as_is'],
    },
    strokePower: {
        label: 'Stroke Power',
        printable: printables['watts'],
    },
    strokeCalories: {
        label: 'Stroke Calories',
        printable: printables['calories'],
    },
    strokeCount: {
        label: 'Stroke Count',
        printable: printables['as_is'],
    },
    projectedWorkTime: {
        label: 'Projected Work Time',
        printable: printables['secs2hms'],
    },
    projectedWorkDistance: {
        label: 'Projected Work Distance',
        printable: printables['metres'],
    },
    workPerStroke: {
        label: 'Work Per Stroke',
        printable: printables['watts'],
    },
    splitIntervalTime: {
        label: 'Split Interval Time',
        printable: printables['secs2hms'],
    },
    splitIntervalDistance: {
        label: 'Split Interval Distance',
        printable: printables['metres'],
    },
    intervalRestTime: {
        label: 'Interval Rest Time',
        printable: printables['secs2hms'],
    },
    intervalRestDistance: {
        label: 'Interval Rest Distance',
        printable: printables['metres'],
    },
    splitIntervalType: {
        label: 'Split Interval Type',
        printable: printables['splitIntervalType'],
    },
    splitIntervalNumber: {
        label: 'Split Interval Number',
        printable: printables['as_is'],
    },
    splitIntervalAverageStrokeRate: {
        label: 'Split Interval Average Stroke Rate',
        printable: printables['as_is'],
    },
    splitIntervalWorkHeartrate: {
        label: 'Split Interval Work Heart Rate',
        printable: printables['as_is'],
    },
    splitIntervalRestHeartRate: {
        label: 'Split Interval Rest Heart Rate',
        printable: printables['as_is'],
    },
    splitIntervalAveragePace: {
        label: 'Split Interval Average Pace',
        printable: printables['secs2hms'],
    },
    splitIntervalTotalCalories: {
        label: 'Split Interval Total Calories',
        printable: printables['calories'],
    },
    splitIntervalAverageCalories: {
        label: 'Split Interval Average Calories',
        printable: printables['calories'],
    },
    splitIntervalSpeed: {
        label: 'Split Interval Speed',
        printable: printables['secs2hms'],
    },
    splitIntervalPower: {
        label: 'Split Interval Power',
        printable: printables['watts'],
    },
    splitAverageDragFactor: {
        label: 'Split Average Drag Factor',
        printable: printables['as_is'],
    },
    splitIntervalNumber: {
        label: 'Split Interval Number',
        printable: printables['as_is'],
    },
    logEntryDate: {
        label: 'Log Entry Date',
        printable: printables['empty'],
    },
    logEntryTime: {
        label: 'Log Entry Time',
        printable: printables['empty'],
    },
    timeElapsed: {
        label: 'Time Elapsed',
        printable: printables['secs2hms'],
    },
    avgStrokeRate: {
        label: 'Average Stroke Rate',
        printable: printables['as_is'],
    },
    endingHeartRate: {
        label: 'Ending Heart Rate',
        printable: printables['as_is'],
    },
    averageHeartRate: {
        label: 'Average Heart Rate',
        printable: printables['as_is'],
    },
    minHeartRate: {
        label: 'Min Heart Rate',
        printable: printables['as_is'],
    },
    maxHeartRate: {
        label: 'Max Heart Rate',
        printable: printables['as_is'],
    },
    dragFactorAverage: {
        label: 'Drag Factor Average',
        printable: printables['as_is'],
    },
    recoveryHeartRate: {
        label: 'Recovery Heart Rate',
        printable: printables['as_is'],
    }
};

class Monitor {
    /*
     */
    constructor() {
        this.idObjectMap = new Map();
        this.eventTarget = new EventTarget();
    }

    /*
     */
    addEventListener(type, callback) {
        this.eventTarget.addEventListener(type, callback);
        switch (type) {
            case 'general-status':
                return this._addGeneralStatusListener();
                break;

            case 'workout-end':
                return this._addWorkoutEndListener();
                break;

            case 'multiplexed-information':
                return this._addMultiplexedInformationListener();
                break;

            case 'additional-status':
                return this._addAdditionalStatus();
                break;

            case 'additional-status2':
                return this._addAdditionalStatus2();
                break;

            case 'stroke-data':
                return this._addStrokeData();
                break;

            case 'additional-stroke-data':
                return this._addAdditionalStrokeData();
                break;

            case 'split-interval-data':
                return this._addSplitIntervalData();
                break;

            case 'additional-split-interval-data':
                return this._addAdditionalSplitIntervalData();
                break;

            case 'force-curve-data':
                return this._addForceCurveData();
                break;
        }
    }

    /*
     */
    removeEventListener(type, callback) {
        this.eventTarget.removeEventListener(type, callback);
        switch (type) {
            case 'general-status':
                return this._removeGeneralStatusListener();
                break;

            case 'workout-end':
                return this._removeWorkoutEndListener();
                break;

            case 'multiplexed-information':
                return this._removeMultiplexedInformationListener();
                break;

            case 'additional-status':
                return this._removeAdditionalStatus();
                break;

            case 'additional-status2':
                return this._removeAdditionalStatus2();
                break;

            case 'stroke-data':
                return this._removeStrokeData();
                break;

            case 'additional-stroke-data':
                return this._removeAdditionalStrokeData();
                break;

            case 'split-interval-data':
                return this._removeSplitIntervalData();
                break;

            case 'additional-split-interval-data':
                return this._removeAdditionalSplitIntervalData();
                break;

            case 'force-curve-data':
                return this._removeForceCurveData();
                break;
        }
    }

    /*
     */
    connect() {
        if (!navigator.bluetooth) {
            return Promise.reject('Bluetooth not available');
        }

        return navigator.bluetooth.requestDevice({
            filters: [{
                services: [
                    services.discovery.id
                ]
            }],
            optionalServices: [
                services.information.id,
                services.control.id,
                services.rowing.id
            ]
        })
        .then(device => {
            this.device = device;
            this.device.addEventListener('gattserverdisconnected', () => {
                console.log('gattserverdisconnected');
                this.idObjectMap.clear();
                this.eventTarget.dispatchEvent({ type: 'disconnect'});
            });
            return device.gatt.connect();
        })
        .then(server => {
            this.server = server;
            return Promise.resolve();
        });
    }

    /*
     */
    disconnect() {
        if (!this.connected()) {
            return Promise.resolve();
        }
        /* try: removeEventListener here, before we ask to disconnect */
        return this.device.gatt.disconnect();
    }

    /*
     */
    connected() {
        return this.device && this.device.gatt && this.device.gatt.connected;
    }

    /*
     */
    _getService(service) {
        const serviceObject = this.idObjectMap.get(service.id);

        if (serviceObject) {
            return Promise.resolve(serviceObject);
        }

        return this.server.getPrimaryService(service.id)
            .then(s => {
                this.idObjectMap.set(service.id, s);
                return Promise.resolve(s);
            });
    }

    /*
     * 0x003d is not multiplexed.
     */
    _cbForceCurveData(monitor, e) {
        const v = new Uint8Array(e.target.value.buffer);
        const numCharacteristics = (v[0] & 0xf0) >> 4;
        const numDataPoints = v[0] & 0x0f;
        let data = [];

        for (let i = 0; i < numDataPoints; i++) {
            data.push(v[i] + (v[i+1] << 8));
        }

        const event = {
            type: 'force-curve-data',
            source: monitor,
            raw: e.target.value,
            data: {
                numCharacteristics: numCharacteristics,
                numDataPoints: numDataPoints,
                data: data
            }
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime          = N/A
     * distance             = N/A
     * workoutType          = CSAFE_PM_GET_WORKOUTTYPE
     * intervalType         = CSAFE_PM_GET_INTERVALTYPE
     * workoutState         = CSAFE_PM_GET_WORKOUTSTATE
     * rowingState          = CSAFE_PM_GET_ROWINGSTATE
     * strokeState          = CSAFE_PM_GET_STROKESTATE
     * totalWorkDistance    = CSAFE_PM_GET_WORKDISTANCE
     * workoutDuration      = CSAFE_PM_GET_WORKOUTDURATION
     * workoutDurationType  = CSAFE_PM_GET_WORKOUTDURATION
     * dragFactor           = CSAFE_PM_GET_DRAGFACTOR
     */
    _extractGeneralStatus(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        let data = {
            elapsedTime:        (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            distance:           (v[o+3] + (v[o+4] << 8) + (v[o+5] << 16)) * 0.1,
            workoutType:        v[o+6],
            intervalType:       v[o+7],
            workoutState:       v[o+8],
            rowingState:        v[o+9],
            strokeState:        v[o+10],
            totalWorkDistance:  (v[o+11] + (v[o+12] << 8) + (v[o+13] << 16)),
            workoutDuration:    (v[o+14] + (v[o+15] << 8) + (v[o+16] << 16)),
            workoutDurationType:v[o+17],
            dragFactor:         v[o+18]
        };

        /*
         * C2 BT CID: page 11, 0x0031 characteristic
         * "Workout Duration Lo (if time, 0.01 sec lsb)"
         *
         * enum DurationTypes {
         *      CSAFE_TIME_DURATION = 0,
         *      CSAFE_CALORIES_DURATION = 0x40,
         *      CSAFE_DISTANCE_DURATION = 0x80,
         *      CSAFE_WATTS_DURATION = 0xc0
         * }
         */
        if (data.workoutDurationType == 0x0) {
            data.workoutDuration *= 0.01;
        }

        return data;
    }

    /*
     */
    _cbGeneralStatus(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'general-status',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractGeneralStatus(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime      = N/A
     * speed            = CSAFE_GETSPEED
     * strokeRate       = CSAFE_PM_GET_STROKESTATE
     * heartRate        = CSAFE_PM_GET_AVG_HEARTRATE
     * currentPace      = N/A
     * averagePace      = CSAFE_PM_GET_TOTAL_AVG_500MPACE
     * restDistance     = CSAFE_PM_GET_RESTDISTANCE
     * restTime         = CSAFE_PM_GET_RESTTIME
     */
    _extractAdditionalStatus(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:        (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            speed:              (v[o+3] + (v[o+4] << 8)) * 0.001,
            strokeRate:         v[o+5],
            heartRate:          v[o+6],
            currentPace:        (v[o+7] + (v[o+8] << 8)) * 0.01,
            averagePace:        (v[o+9] + (v[o+10] << 8)) * 0.01,
            restDistance:       (v[o+11] + (v[o+12] << 8)),
            restTime:           (v[o+13] + (v[o+14] << 8) + (v[o+15] << 16)) * 0.01
        };
    }

    /*
     */
    _cbAdditionalStatus(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'additional-status',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractAdditionalStatus(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime          = N/A
     * intervalCount        = CSAFE_PM_GET_WORKOUTINTERVALCOUNT
     * averagePower         = CSAFE_PM_GET_TOTAL_AVG_POWER
     * totalCalories        = CSAFE_PM_GET_TOTAL_AVG_CALORIES
     * splitAveragePace     = CSAFE_PM_GET_SPLIT_AVG_500MPACE
     * splitAveragePower    = CSAFE_PM_GET_SPLIT_AVG_POWER
     * splitAverageCalories = CSAFE_PM_GET_SPLIT_AVG_CALORIES
     * lastSplitTime        = CSAFE_PM_GET_LAST_SPLITTIME
     * lastSplitDistance    = CSAFE_PM_GET_LAST_SPLITDISTANCE
     */
    _extractAdditionalStatus2(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:            (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            intervalCount:          v[o+3],
            averagePower:           (v[o+4] + (v[o+5] << 8)),
            totalCalories:          (v[o+6] + (v[o+7] << 8)),
            splitAveragePace:       (v[o+8] + (v[o+9] << 8)) * 0.01,
            splitAveragePower:      (v[o+10] + (v[o+11] << 8)),
            splitAverageCalories:   (v[o+12] + (v[o+13] << 8)),
            lastSplitTime:          (v[o+14] + (v[o+15] << 8) + (v[o+16] << 16)),
            lastSplitDistance:      (v[o+17] + (v[o+18] << 8) + (v[o+19] << 16))
        };
    }

    /*
     */
    _cbAdditionalStatus2(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'additional-status2',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractAdditionalStatus2(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime          = N/A
     * distance             = N/A
     * driveLength          = CSAFE_PM_GET_STROKESTATS
     * driveTime            = CSAFE_PM_GET_STROKESTATS
     * strokeRecoveryTime   = CSAFE_PM_GET_STROKESTATS
     * strokeDistance       = CSAFE_PM_GET_STROKESTATS
     * peakDriveForce       = CSAFE_PM_GET_STROKESTATS
     * averageDriveForce    = CSAFE_PM_GET_STROKESTATS
     * workPerStroke        = CSAFE_PM_GET_STROKESTATS
     * strokeCount          = CSAFE_PM_GET_STROKESTATS
     */
    _extractStrokeData(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:            (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            distance:               (v[o+3] + (v[o+4] << 8) + (v[o+5] << 16)) * 0.1,
            driveLength:            v[o+6] * 0.01,
            driveTime:              v[o+7] * 0.01,
            strokeRecoveryTime:     (v[o+8] + (v[o+9] << 8)) * 0.01,
            strokeDistance:         (v[o+10] + (v[o+11] << 8)) * 0.01,
            peakDriveForce:         (v[o+12] + (v[o+13] << 8)) * 0.1,   /* XXX pounds */
            averageDriveForce:      (v[o+14] + (v[o+15] << 8)) * 0.1,   /* XXX pounds */
            workPerStroke:          (v[o+16] + (v[o+17] << 8)),
            strokeCount:            (v[o+18] + (v[o+19] << 8))
        };
    }

    /*
     */
    _cbStrokeData(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'stroke-data',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractStrokeData(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime              = N/A
     * strokePower              = CSAFE_PM_GET_STROKE_POWER
     * strokeCalories           = CSAFE_PM_GET_STROKE_CALORICBURNRATE
     * strokeCount              = CSAFE_PM_GET_STROKESTATS
     * projectedWorkTime        = N/A
     * projectedWorkDistance    = N/A
     * workPerStroke            = N/A
     */
    _extractAdditionalStrokeData(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:            (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            strokePower:            (v[o+3] + (v[o+4] << 8)),
            strokeCalories:         (v[o+5] + (v[o+6] << 8)),
            strokeCount:            (v[o+7] + (v[o+8] << 8)),
            projectedWorkTime:      (v[o+9] + (v[o+10] << 8) + (v[o+11] << 16)),
            projectedWorkDistance:  (v[o+12] + (v[o+13] << 8) + (v[o+14] << 16))
        };
    }

    /*
     */
    _cbAdditionalStrokeData(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'additional-stroke-data',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractAdditionalStrokeData(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime              = N/A
     * distance                 = N/A
     * splitIntervalTime        = N/A
     * splitIntervalDistance    = N/A
     * intervalRestTime         = N/A
     * intervalRestDistance     = N/A
     * splitIntervalType        = N/A
     * splitIntervalNumber      = N/A
     */
    _extractSplitIntervalData(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:            (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            distance:               (v[o+3] + (v[o+4] << 8) + (v[o+5] << 16)) * 0.1,
            splitIntervalTime:      (v[o+6] + (v[o+7] << 8) + (v[o+8] << 16)) * 0.1,
            splitIntervalDistance:  (v[o+9] + (v[o+10] << 8) + (v[o+11] << 16)),
            intervalRestTime:       v[o+12] + (v[o+13] << 8),
            intervalRestDistance:   v[o+14] + (v[o+15] << 8),
            splitIntervalType:      v[o+16],
            splitIntervalNumber:    v[o+17]
        };
    }

    /*
     */
    _cbSplitIntervalData(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'split-interval-data',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractSplitIntervalData(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * elapsedTime                      = N/A
     * splitIntervalAverageStrokeRate   = N/A
     * splitIntervalWorkHeartrate       = N/A
     * splitIntervalRestHeartRate       = N/A
     * splitIntervalAveragePace         = N/A
     * splitIntervalTotalCalories       = N/A
     * splitIntervalAverageCalories     = N/A
     * splitIntervalSpeed               = N/A
     * splitIntervalPower               = N/A
     * splitAverageDragFactor           = N/A
     * splitIntervalNumber              = N/A
     */
    _extractAdditionalSplitIntervalData(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            elapsedTime:                    (v[o+0] + (v[o+1] << 8) + (v[o+2] << 16)) * 0.01,
            splitIntervalAverageStrokeRate: v[o+3],
            splitIntervalWorkHeartrate:     v[o+4],
            splitIntervalRestHeartRate:     v[o+5],
            splitIntervalAveragePace:       (v[o+6] + (v[o+7] << 8)) * 0.1,
            splitIntervalTotalCalories:     (v[o+8] + (v[o+9] << 8)),
            splitIntervalAverageCalories:   (v[o+10] + (v[o+11] << 8)),
            splitIntervalSpeed:             (v[o+12] + (v[o+13] << 8)) * 0.001,
            splitIntervalPower:             (v[o+14] + (v[o+15] << 8)),
            splitAverageDragFactor:         v[o+16],
            splitIntervalNumber:            v[o+17]
        };
    }

    /*
     */
    _cbAdditionalSplitIntervalData(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'additional-split-interval-data',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractAdditionalSplitIntervalData(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     * CSAFE equivalent commands:
     *
     * logEntryDate         = N/A
     * logEntryTime         = N/A
     * timeElapsed          = N/A
     * distance             = N/A
     * avgStrokeRate        = N/A
     * endingHeartRate      = N/A
     * averageHeartRate     = N/A
     * minHeartRate         = N/A
     * maxHeartRate         = N/A
     * dragFactorAverage    = N/A
     * recoveryHeartRate    = N/A
     * workoutType          = N/A
     * averagePace          = N/A
     */
    _extractEndOfWorkoutSummary(e, multiplexed = false) {
        const o = multiplexed ? 1 : 0;
        const v = new Uint8Array(e.target.value.buffer);

        return {
            logEntryDate:       (v[o+0] + (v[o+1] << 8)),
            logEntryTime:       (v[o+2] + (v[o+3] << 8)),
            timeElapsed:        (v[o+4] + (v[o+5] << 8) + (v[o+6] << 16)) * 0.01,
            distance:           (v[o+7] + (v[o+8] << 8) + (v[o+9] << 16)) * 0.1,
            avgStrokeRate:      v[o+10],
            endingHeartRate:    v[o+11],
            averageHeartRate:   v[o+12],
            minHeartRate:       v[o+13],
            maxHeartRate:       v[o+14],
            dragFactorAverage:  v[o+15],
            recoveryHeartRate:  v[o+16],
            workoutType:        v[o+17],
            averagePace:        (v[o+18] + (v[o+19] << 8)) * 0.1
        };
    }

    /*
     */
    _cbEndOfWorkoutSummaryData(monitor, e, multiplexed = false) {
        const event = {
            type: multiplexed ? 'multiplexed-information' : 'workout-end',
            source: monitor,
            raw: e.target.value,
            data: monitor._extractEndOfWorkoutSummary(e, multiplexed)
        };

        monitor.eventTarget.dispatchEvent(event);
    }

    /*
     */
    _cbMultiplexedInformation(monitor, e) {
        const characteristic = e.target.value.getUint8();

        /* up to here */

        /* XXX make this a jump table */
        switch (characteristic) {
            case 0x31: monitor._cbGeneralStatus(monitor, e, true); break;
            case 0x32: monitor._cbAdditionalStatus(monitor, e, true); break;
            case 0x33: monitor._cbAdditionalStatus2(monitor, e, true); break;
            case 0x35: monitor._cbStrokeData(monitor, e, true); break;
            case 0x36: monitor._cbAdditionalStrokeData(monitor, e, true); break;
            case 0x37: monitor._cbSplitIntervalData(monitor, e, true); break;
            case 0x38: monitor._cbAdditionalSplitIntervalData(monitor, e, true); break;
            case 0x39: monitor._cbEndOfWorkoutSummaryData(monitor, e, true); break;
            /*
            case 0x3a: monitor._cbAdditionalEndOfWorkoutSummaryData(monitor, e, true); break;
            case 0x3b: monitor._cbHeartRateBeltInformation(monitor, e, true); break;
            case 0x3c: monitor._cbAdditionalEndOfWorkoutSummaryData2(monitor, e, true); break;
            */
            default:
                console.log('unhandled characteristic ' + characteristic.toString(16));
                break;
        }
    }

    /*
     */
    _getCharacteristic(characteristic) {
        const characteristicObject = this.idObjectMap.get(characteristic.id);

        if (characteristicObject) {
            return Promise.resolve(characteristicObject);
        }

        return this._getService(characteristic.service)
            .then(service => {
                return service.getCharacteristic(characteristic.id);
            })
            .then(c => {
                this.idObjectMap.set(characteristic.id, c);
                return Promise.resolve(c);
            });
    }

    /*
     */
    _setupCharacteristicValueListener(characteristic, callback) {
        const monitor = this;
        return this._getCharacteristic(characteristic)
            .then(c => {
                return c.startNotifications();
            })
            .then(c => {
                c.addEventListener('characteristicvaluechanged', e => {
                    callback(monitor, e);
                });
                return Promise.resolve();
            });
    }

    /*
     */
    _teardownCharacteristicValueListener(characteristic, callback) {
        const monitor = this;
        return this._getCharacteristic(characteristic)
            .then(c => {
                return c.stopNotifications();
            })
            .then(c => {
                c.removeEventListener('characteristicvaluechanged', e => {
                    callback(monitor, e);
                });
                return Promise.resolve();
            });
    }

    /*
     */
    _addWorkoutEndListener() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.endOfWorkoutSummaryData, this._cbEndOfWorkoutSummaryData
        );
    }

    /*
     */
    _removeWorkoutEndListener() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.endOfWorkoutSummaryData, this._cbEndOfWorkoutSummaryData
        );
    }

    /*
     */
    _addGeneralStatusListener() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.generalStatus, this._cbGeneralStatus
        );
    }

    /*
     */
    _removeGeneralStatusListener() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.generalStatus, this._cbGeneralStatus
        );
    }

    /*
     */
    _addMultiplexedInformationListener() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.multiplexedInformation, this._cbMultiplexedInformation
        );
    }

    /*
     */
    _removeMultiplexedInformationListener() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.multiplexedInformation, this._cbMultiplexedInformation
        );
    }

    _addAdditionalStatus() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStatus, this._cbAdditionalStatus
        );
    }

    _removeAdditionalStatus() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStatus, this._cbAdditionalStatus
        );
    }

    _addAdditionalStatus2() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStatus, this._cbAdditionalStatus2
        );
    }

    _removeAdditionalStatus2() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStatus, this._cbAdditionalStatus2
        );
    }

    _addStrokeData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.strokeData, this._cbStrokeData
        );
    }

    _removeStrokeData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.strokeData, this._cbStrokeData
        );
    }

    _addAdditionalStrokeData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStrokeData, this._cbAdditionalStrokeData
        );
    }

    _removeAdditionalStrokeData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalStrokeData, this._cbAdditionalStrokeData
        );
    }

    _addSplitIntervalData() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.splitIntervalData, this._cbSplitIntervalData
        );
    }

    _removeSplitIntervalData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.splitIntervalData, this._cbSplitIntervalData
        );
    }

    _addAdditionalSplitIntervalData() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.additionalSplitIntervalData, this._cbAdditionalSplitIntervalData
        );
    }

    _removeAdditionalSplitIntervalData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.additionalSplitIntervalData, this._cbAdditionalSplitIntervalData
        );
    }

    _addForceCurveData() {
        return this._setupCharacteristicValueListener(
                characteristics.rowingService.forceCurveData, this._cbForceCurveData
        );
    }

    _removeForceCurveData() {
        return this._teardownCharacteristicValueListener(
                characteristics.rowingService.forceCurveData, this._cbForceCurveData
        );
    }

    /*
     */
    _getStringCharacteristicValue(characteristic) {
        const decoder = new TextDecoder('utf-8');

        return this._getCharacteristic(characteristic)
            .then(c => {
                return c.readValue()
            })
            .then(v => {
                return decoder.decode(v);
            });
    }

    /*
     */
    getModelNumber() {
        return this._getStringCharacteristicValue(characteristics.informationService.modelNumber);
    }

    /*
     */
    getSerialNumber() {
        return this._getStringCharacteristicValue(characteristics.informationService.serialNumber);
    }

    /*
     */
    getHardwareRevision() {
        return this._getStringCharacteristicValue(characteristics.informationService.hardwareRevision);
    }

    /*
     */
    getFirmwareRevision() {
        return this._getStringCharacteristicValue(characteristics.informationService.firmwareRevision);
    }

    /*
     */
    getManufacturerName() {
        return this._getStringCharacteristicValue(characteristics.informationService.manufacturerName);
    }

    /*
     */
    getMachineType() {
        return this._getCharacteristic(characteristics.informationService.machineType)
            .then(c => {
                return c.readValue()
            })
            .then(v => {
                return v.getUint8(0);
            });
    }

    /*
     */
    getMonitorInformation() {
        const monitorInformation = {};

        return this.getModelNumber()
            .then(modelNumber => {
                monitorInformation.modelNumber = modelNumber;
                return this.getSerialNumber();
            })
            .then(serialNumber => {
                monitorInformation.serialNumber = serialNumber;
                return this.getHardwareRevision();
            })
            .then(hardwareRevision => {
                monitorInformation.hardwareRevision = hardwareRevision;
                return this.getFirmwareRevision();
            })
            .then(firmwareRevision => {
                monitorInformation.firmwareRevision = firmwareRevision;
                return this.getManufacturerName();
            })
            .then(manufacturerName => {
                monitorInformation.manufacturerName = manufacturerName;
                return this.getMachineType();
            })
            .then(machineType => {
                monitorInformation.machineType = machineType;
                return Promise.resolve(monitorInformation);
            })
            .catch(error => {
                console.log(error);
            });
    }
};
