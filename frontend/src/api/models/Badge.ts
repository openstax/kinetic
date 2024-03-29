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
 * @interface Badge
 */
export interface Badge {
    /**
     * Badge ID
     * @type {string}
     * @memberof Badge
     */
    readonly id?: string;
    /**
     * Badge name
     * @type {string}
     * @memberof Badge
     */
    readonly name?: string;
    /**
     * Badge description
     * @type {string}
     * @memberof Badge
     */
    readonly description?: string;
    /**
     * Badge image
     * @type {string}
     * @memberof Badge
     */
    readonly image?: string;
    /**
     * Badge tags
     * @type {Array<string>}
     * @memberof Badge
     */
    tags?: Array<string>;
}

/**
 * Check if a given object implements the Badge interface.
 */
export function instanceOfBadge(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BadgeFromJSON(json: any): Badge {
    return BadgeFromJSONTyped(json, false);
}

export function BadgeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Badge {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'image': !exists(json, 'image') ? undefined : json['image'],
        'tags': !exists(json, 'tags') ? undefined : json['tags'],
    };
}

export function BadgeToJSON(value?: Badge | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tags': value.tags,
    };
}

