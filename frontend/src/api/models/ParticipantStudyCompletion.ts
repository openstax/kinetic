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
 * @interface ParticipantStudyCompletion
 */
export interface ParticipantStudyCompletion {
    /**
     * When the stage was aborted; null indicates stage was marked complete
     * @type {Date}
     * @memberof ParticipantStudyCompletion
     */
    abortedAt?: Date;
    /**
     * When the study was completed; null indicates study is not yet complete
     * @type {Date}
     * @memberof ParticipantStudyCompletion
     */
    completedAt?: Date;
}

/**
 * Check if a given object implements the ParticipantStudyCompletion interface.
 */
export function instanceOfParticipantStudyCompletion(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ParticipantStudyCompletionFromJSON(json: any): ParticipantStudyCompletion {
    return ParticipantStudyCompletionFromJSONTyped(json, false);
}

export function ParticipantStudyCompletionFromJSONTyped(json: any, ignoreDiscriminator: boolean): ParticipantStudyCompletion {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'abortedAt': !exists(json, 'aborted_at') ? undefined : (new Date(json['aborted_at'])),
        'completedAt': !exists(json, 'completed_at') ? undefined : (new Date(json['completed_at'])),
    };
}

export function ParticipantStudyCompletionToJSON(value?: ParticipantStudyCompletion | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'aborted_at': value.abortedAt === undefined ? undefined : (value.abortedAt.toISOString()),
        'completed_at': value.completedAt === undefined ? undefined : (value.completedAt.toISOString()),
    };
}

