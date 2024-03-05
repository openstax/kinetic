/* tslint:disable */
/* eslint-disable */
/**
 * OpenStax Kinetic API
 * The Kinetic API for OpenStax.  Requests to this API should include `application/json` in the `Accept` header.  The desired API version is specified in the request URL, e.g. `[domain]/api/v1/researcher/studies`. While the API does support a default version, that version will change over time and therefore should not be used in production code! 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface StudyIds1
 */
export interface StudyIds1 {
    /**
     * Studies to be highlighted
     * @type {Array<number>}
     * @memberof StudyIds1
     */
    highlightedIds?: Array<number>;
}

/**
 * Check if a given object implements the StudyIds1 interface.
 */
export function instanceOfStudyIds1(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function StudyIds1FromJSON(json: any): StudyIds1 {
    return StudyIds1FromJSONTyped(json, false);
}

export function StudyIds1FromJSONTyped(json: any, ignoreDiscriminator: boolean): StudyIds1 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'highlightedIds': !exists(json, 'highlighted_ids') ? undefined : json['highlighted_ids'],
    };
}

export function StudyIds1ToJSON(value?: StudyIds1 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'highlighted_ids': value.highlightedIds,
    };
}
