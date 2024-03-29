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
 * @interface BadgeInfo
 */
export interface BadgeInfo {
    /**
     * Badge ID
     * @type {string}
     * @memberof BadgeInfo
     */
    readonly id?: string;
    /**
     * Badge name
     * @type {string}
     * @memberof BadgeInfo
     */
    readonly name?: string;
    /**
     * Badge image
     * @type {string}
     * @memberof BadgeInfo
     */
    readonly image?: string;
    /**
     * Badge image (small)
     * @type {string}
     * @memberof BadgeInfo
     */
    readonly imageSmall?: string;
}

/**
 * Check if a given object implements the BadgeInfo interface.
 */
export function instanceOfBadgeInfo(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BadgeInfoFromJSON(json: any): BadgeInfo {
    return BadgeInfoFromJSONTyped(json, false);
}

export function BadgeInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): BadgeInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'image': !exists(json, 'image') ? undefined : json['image'],
        'imageSmall': !exists(json, 'image_small') ? undefined : json['image_small'],
    };
}

export function BadgeInfoToJSON(value?: BadgeInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

