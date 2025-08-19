export interface DoNotTouch {
    doNotRemove: string;
    butRemoveBulkOf?: string[];
}

export enum CleanUpLevel {
    OnlyFirst,  // Cleans only parent object properties (keep only id), but keeps child objects intact
    OnlySecond, // Keeps parent object properties, but cleans child objects (keep only id)
    CleanAll,         // Cleans both parent and child objects (keep only id)
    KeepAll           // do not remove anything from array
}


export const ObjectService = {

    removePropertiesExceptId(obj: any): any {
        // Implementation to keep only 'id' property
        if (obj && typeof obj === 'object') {
            const newObj: any = {};
            if ('id' in obj) {
                newObj.id = obj.id;
            }
            return newObj;
        }
        return obj;
    },

    simplyClean(obj: any, doNotRemove: string[] = []): any {

        if (obj === null || obj === undefined) {
            return obj;
        }

        if (Array.isArray(obj)) {
            const arrayObj = obj.map(o => this.simplyClean(o, doNotRemove))
            return arrayObj;
        }

        const cleanedObj: any = {}
        if (obj && typeof obj === 'object') {

            if ('id' in obj) {
                cleanedObj.id = obj.id;
            }
            for (const [key, val] of Object.entries(obj)) {
                if (doNotRemove.includes(key)) {
                    cleanedObj[key] = val
                }
                else if (typeof val === 'object') {
                    this.simplyClean(val, doNotRemove)
                }
            }

        }
    },

    removeBulk(obj: object, doNotTouchObjNames: DoNotTouch[]): any {
        // Return if obj is null or undefined
        if (obj === null || obj === undefined) {
            return obj;
        }

        // Handle array case
        if (Array.isArray(obj)) {
            return obj.map(item => this.removeBulk(item, doNotTouchObjNames));
        }

        // Handle primitive values
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const result: any = {};

        // Process each property in the object
        for (const [key, value] of Object.entries(obj)) {
            // Find matching DoNotTouch rule for this property
            const doNotTouchRule = doNotTouchObjNames.find(rule => rule.doNotRemove === key);


            if (Array.isArray(value)) {
                const cleanedList = []
                for (const item of value) {
                    // Create an object with the current item (assuming items are objects)
                    let valObj = { [key]: item };  // Note the change here to use computed property name
                    let cleanedObj = this.removeBulk(valObj, doNotTouchObjNames);

                    // Check if the cleaned object still has our key
                    if (cleanedObj.hasOwnProperty(key)) {
                        cleanedList.push(cleanedObj[key]);
                    }
                }

                result[key] = cleanedList;
            } else {
                if (!doNotTouchRule) {
                    // Property not in doNotTouchObjNames - keep only id
                    result[key] = this.removePropertiesExceptId(value);
                } else if (!doNotTouchRule.butRemoveBulkOf) {
                    // Property is in doNotTouchObjNames and has no butRemoveBulkOf - keep as is
                    result[key] = value;
                } else {
                    // Property is in doNotTouchObjNames and has butRemoveBulkOf
                    if (typeof value === 'object' && value !== null) {
                        const newValue: any = {};
                        // Keep only properties listed in butRemoveBulkOf
                        for (const prop of doNotTouchRule.butRemoveBulkOf) {
                            if (prop in value) {
                                newValue[prop] = (value as any)[prop];
                            }
                        }
                        // For other properties in the object, keep only id
                        for (const prop in value) {
                            if (!doNotTouchRule.butRemoveBulkOf.includes(prop)) {
                                newValue[prop] = this.removePropertiesExceptId((value as any)[prop]);
                            }
                        }
                        result[key] = newValue;
                    } else {
                        result[key] = value;
                    }
                }
            }


        }

        return result;
    }

    ,

    firstLevelCleanUp(obj: any): any {
        const result: any = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // If it's an object, keep it as is
                result[key] = obj[key];
            } else if (key === 'id') {
                // Keep the id property
                result[key] = obj[key];
            }
        }
        return result;
    },

    secondLevelCleanUp(obj: any): any {
        const result: any = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // If it's an object, clean it (keep only id)
                result[key] = this.removePropertiesExceptId(obj[key]);
            } else {
                // Keep all primitive properties
                result[key] = obj[key];
            }
        }
        return result;
    }

    ,

    cleanAll(obj: any): any {
        const result: any = {};
        for (const key in obj) {
            if (key === 'id') {
                result[key] = obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recursively clean all nested objects
                result[key] = this.cleanAll(obj[key]);
            }
        }
        return result;
    },

    removeBulkFromList(anyObjectList: any[], level: CleanUpLevel): any[] {
        const results = [];
        for (const obj of anyObjectList) {
            let cleanedObj;
            switch (level) {
                case CleanUpLevel.OnlyFirst:
                    cleanedObj = this.firstLevelCleanUp(obj);
                    break;
                case CleanUpLevel.OnlySecond:
                    cleanedObj = this.secondLevelCleanUp(obj);
                    break;
                case CleanUpLevel.CleanAll:
                    cleanedObj = this.cleanAll(obj);
                    break;
                case CleanUpLevel.KeepAll:
                default:
                    cleanedObj = obj;
                    break;
            }
            results.push(cleanedObj);
        }
        return results;
    }

}
