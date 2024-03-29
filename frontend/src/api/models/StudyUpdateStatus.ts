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
import type { Study } from './Study';
import {
    StudyFromJSON,
    StudyFromJSONTyped,
    StudyToJSON,
} from './Study';

/**
 * 
 * @export
 * @interface StudyUpdateStatus
 */
export interface StudyUpdateStatus {
    /**
     * 
     * @type {Study}
     * @memberof StudyUpdateStatus
     */
    study?: Study;
}

/**
 * Check if a given object implements the StudyUpdateStatus interface.
 */
export function instanceOfStudyUpdateStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function StudyUpdateStatusFromJSON(json: any): StudyUpdateStatus {
    return StudyUpdateStatusFromJSONTyped(json, false);
}

export function StudyUpdateStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudyUpdateStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'study': !exists(json, 'study') ? undefined : StudyFromJSON(json['study']),
    };
}

export function StudyUpdateStatusToJSON(value?: StudyUpdateStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'study': StudyToJSON(value.study),
    };
}

