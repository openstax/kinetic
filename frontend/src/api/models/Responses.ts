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
 * @interface Responses
 */
export interface Responses {
    /**
     * The Responses download ID.
     * @type {number}
     * @memberof Responses
     */
    readonly id: number;
    /**
     * Status of the request
     * @type {string}
     * @memberof Responses
     */
    status: ResponsesStatusEnum;
    /**
     * URL(s) to download study responses from
     * @type {Array<string>}
     * @memberof Responses
     */
    responseUrls?: Array<string>;
    /**
     * The reason for the request failure
     * @type {string}
     * @memberof Responses
     */
    error?: string;
}


/**
 * @export
 */
export const ResponsesStatusEnum = {
    Pending: 'pending',
    Complete: 'complete',
    Error: 'error'
} as const;
export type ResponsesStatusEnum = typeof ResponsesStatusEnum[keyof typeof ResponsesStatusEnum];


/**
 * Check if a given object implements the Responses interface.
 */
export function instanceOfResponses(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "status" in value;

    return isInstance;
}

export function ResponsesFromJSON(json: any): Responses {
    return ResponsesFromJSONTyped(json, false);
}

export function ResponsesFromJSONTyped(json: any, ignoreDiscriminator: boolean): Responses {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'status': json['status'],
        'responseUrls': !exists(json, 'response_urls') ? undefined : json['response_urls'],
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}

export function ResponsesToJSON(value?: Responses | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'status': value.status,
        'response_urls': value.responseUrls,
        'error': value.error,
    };
}

