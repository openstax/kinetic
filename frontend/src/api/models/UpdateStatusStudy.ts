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
 * @interface UpdateStatusStudy
 */
export interface UpdateStatusStudy {
    /**
     * 
     * @type {Study}
     * @memberof UpdateStatusStudy
     */
    study?: Study;
}

/**
 * Check if a given object implements the UpdateStatusStudy interface.
 */
export function instanceOfUpdateStatusStudy(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateStatusStudyFromJSON(json: any): UpdateStatusStudy {
    return UpdateStatusStudyFromJSONTyped(json, false);
}

export function UpdateStatusStudyFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateStatusStudy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'study': !exists(json, 'study') ? undefined : StudyFromJSON(json['study']),
    };
}

export function UpdateStatusStudyToJSON(value?: UpdateStatusStudy | null): any {
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

