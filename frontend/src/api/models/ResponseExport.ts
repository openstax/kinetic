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
 * @interface ResponseExport
 */
export interface ResponseExport {
    /**
     * The Responses download ID.
     * @type {number}
     * @memberof ResponseExport
     */
    readonly id: number;
    /**
     * The ID of the stage
     * @type {number}
     * @memberof ResponseExport
     */
    readonly stageId: number;
    /**
     * Metadata related to the responses
     * @type {object}
     * @memberof ResponseExport
     */
    metadata: object;
    /**
     * is the export/generation complete
     * @type {boolean}
     * @memberof ResponseExport
     */
    isComplete: boolean;
    /**
     * are the files real or testing data
     * @type {boolean}
     * @memberof ResponseExport
     */
    isTesting: boolean;
    /**
     * contains data up to this date
     * @type {string}
     * @memberof ResponseExport
     */
    cutoffAt: string;
    /**
     * URL(s) to download study responses from
     * @type {Array<string>}
     * @memberof ResponseExport
     */
    urls: Array<string>;
}

/**
 * Check if a given object implements the ResponseExport interface.
 */
export function instanceOfResponseExport(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "stageId" in value;
    isInstance = isInstance && "metadata" in value;
    isInstance = isInstance && "isComplete" in value;
    isInstance = isInstance && "isTesting" in value;
    isInstance = isInstance && "cutoffAt" in value;
    isInstance = isInstance && "urls" in value;

    return isInstance;
}

export function ResponseExportFromJSON(json: any): ResponseExport {
    return ResponseExportFromJSONTyped(json, false);
}

export function ResponseExportFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseExport {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'stageId': json['stage_id'],
        'metadata': json['metadata'],
        'isComplete': json['is_complete'],
        'isTesting': json['is_testing'],
        'cutoffAt': json['cutoff_at'],
        'urls': json['urls'],
    };
}

export function ResponseExportToJSON(value?: ResponseExport | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'metadata': value.metadata,
        'is_complete': value.isComplete,
        'is_testing': value.isTesting,
        'cutoff_at': value.cutoffAt,
        'urls': value.urls,
    };
}
