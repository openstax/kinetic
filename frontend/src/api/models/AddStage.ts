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
import type { NewStage } from './NewStage';
import {
    NewStageFromJSON,
    NewStageFromJSONTyped,
    NewStageToJSON,
} from './NewStage';

/**
 * 
 * @export
 * @interface AddStage
 */
export interface AddStage {
    /**
     * 
     * @type {NewStage}
     * @memberof AddStage
     */
    stage?: NewStage;
}

/**
 * Check if a given object implements the AddStage interface.
 */
export function instanceOfAddStage(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function AddStageFromJSON(json: any): AddStage {
    return AddStageFromJSONTyped(json, false);
}

export function AddStageFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddStage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'stage': !exists(json, 'stage') ? undefined : NewStageFromJSON(json['stage']),
    };
}

export function AddStageToJSON(value?: AddStage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'stage': NewStageToJSON(value.stage),
    };
}

