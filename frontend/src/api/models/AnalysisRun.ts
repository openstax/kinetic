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
import type { AnalysisRunMessage } from './AnalysisRunMessage';
import {
    AnalysisRunMessageFromJSON,
    AnalysisRunMessageFromJSONTyped,
    AnalysisRunMessageToJSON,
} from './AnalysisRunMessage';

/**
 * 
 * @export
 * @interface AnalysisRun
 */
export interface AnalysisRun {
    /**
     * ID of analysis run
     * @type {number}
     * @memberof AnalysisRun
     */
    readonly id: number;
    /**
     * Api key to use for recording progress of run
     * @type {string}
     * @memberof AnalysisRun
     */
    apiKey: string;
    /**
     * Commit message of the analysis run
     * @type {string}
     * @memberof AnalysisRun
     */
    message?: string;
    /**
     * Current status of the run
     * @type {string}
     * @memberof AnalysisRun
     */
    status?: AnalysisRunStatusEnum;
    /**
     * The analysis run messages.
     * @type {Array<AnalysisRunMessage>}
     * @memberof AnalysisRun
     */
    messages?: Array<AnalysisRunMessage>;
    /**
     * Id of Analysis
     * @type {number}
     * @memberof AnalysisRun
     */
    analysisId: number;
    /**
     * Api key to obtain analysis data
     * @type {number}
     * @memberof AnalysisRun
     */
    analysisApiKey: number;
    /**
     * When was run started
     * @type {string}
     * @memberof AnalysisRun
     */
    startedAt?: string;
    /**
     * When was run completed
     * @type {string}
     * @memberof AnalysisRun
     */
    finishedAt?: string;
}


/**
 * @export
 */
export const AnalysisRunStatusEnum = {
    Pending: 'pending',
    Complete: 'complete',
    Error: 'error',
    Canceled: 'canceled'
} as const;
export type AnalysisRunStatusEnum = typeof AnalysisRunStatusEnum[keyof typeof AnalysisRunStatusEnum];


/**
 * Check if a given object implements the AnalysisRun interface.
 */
export function instanceOfAnalysisRun(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "apiKey" in value;
    isInstance = isInstance && "analysisId" in value;
    isInstance = isInstance && "analysisApiKey" in value;

    return isInstance;
}

export function AnalysisRunFromJSON(json: any): AnalysisRun {
    return AnalysisRunFromJSONTyped(json, false);
}

export function AnalysisRunFromJSONTyped(json: any, ignoreDiscriminator: boolean): AnalysisRun {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'apiKey': json['api_key'],
        'message': !exists(json, 'message') ? undefined : json['message'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'messages': !exists(json, 'messages') ? undefined : ((json['messages'] as Array<any>).map(AnalysisRunMessageFromJSON)),
        'analysisId': json['analysis_id'],
        'analysisApiKey': json['analysis_api_key'],
        'startedAt': !exists(json, 'started_at') ? undefined : json['started_at'],
        'finishedAt': !exists(json, 'finished_at') ? undefined : json['finished_at'],
    };
}

export function AnalysisRunToJSON(value?: AnalysisRun | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'api_key': value.apiKey,
        'message': value.message,
        'status': value.status,
        'messages': value.messages === undefined ? undefined : ((value.messages as Array<any>).map(AnalysisRunMessageToJSON)),
        'analysis_id': value.analysisId,
        'analysis_api_key': value.analysisApiKey,
        'started_at': value.startedAt,
        'finished_at': value.finishedAt,
    };
}

