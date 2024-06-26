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
 * @interface WelcomeStudyIds
 */
export interface WelcomeStudyIds {
    /**
     * Studies for welcome modal
     * @type {Array<number>}
     * @memberof WelcomeStudyIds
     */
    welcomeIds?: Array<number>;
}

/**
 * Check if a given object implements the WelcomeStudyIds interface.
 */
export function instanceOfWelcomeStudyIds(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function WelcomeStudyIdsFromJSON(json: any): WelcomeStudyIds {
    return WelcomeStudyIdsFromJSONTyped(json, false);
}

export function WelcomeStudyIdsFromJSONTyped(json: any, ignoreDiscriminator: boolean): WelcomeStudyIds {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'welcomeIds': !exists(json, 'welcome_ids') ? undefined : json['welcome_ids'],
    };
}

export function WelcomeStudyIdsToJSON(value?: WelcomeStudyIds | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'welcome_ids': value.welcomeIds,
    };
}

