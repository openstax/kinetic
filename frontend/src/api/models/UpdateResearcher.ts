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
import type { ResearcherUpdate } from './ResearcherUpdate';
import {
    ResearcherUpdateFromJSON,
    ResearcherUpdateFromJSONTyped,
    ResearcherUpdateToJSON,
} from './ResearcherUpdate';

/**
 * 
 * @export
 * @interface UpdateResearcher
 */
export interface UpdateResearcher {
    /**
     * 
     * @type {ResearcherUpdate}
     * @memberof UpdateResearcher
     */
    researcher?: ResearcherUpdate;
}

/**
 * Check if a given object implements the UpdateResearcher interface.
 */
export function instanceOfUpdateResearcher(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateResearcherFromJSON(json: any): UpdateResearcher {
    return UpdateResearcherFromJSONTyped(json, false);
}

export function UpdateResearcherFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateResearcher {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'researcher': !exists(json, 'researcher') ? undefined : ResearcherUpdateFromJSON(json['researcher']),
    };
}

export function UpdateResearcherToJSON(value?: UpdateResearcher | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'researcher': ResearcherUpdateToJSON(value.researcher),
    };
}

