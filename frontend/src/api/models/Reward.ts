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
 * @interface Reward
 */
export interface Reward {
    /**
     * The Reward ID
     * @type {number}
     * @memberof Reward
     */
    id?: number;
    /**
     * The message to display. Limited HTML is supported
     * @type {string}
     * @memberof Reward
     */
    prize?: string;
    /**
     * A description of the reward
     * @type {string}
     * @memberof Reward
     */
    description?: string;
    /**
     * How many points are required to be eligible for the reward
     * @type {number}
     * @memberof Reward
     */
    points?: number;
    /**
     * When the reward starts to be active
     * @type {string}
     * @memberof Reward
     */
    startAt?: string;
    /**
     * When the reward stops being active
     * @type {string}
     * @memberof Reward
     */
    endAt?: string;
}

/**
 * Check if a given object implements the Reward interface.
 */
export function instanceOfReward(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RewardFromJSON(json: any): Reward {
    return RewardFromJSONTyped(json, false);
}

export function RewardFromJSONTyped(json: any, ignoreDiscriminator: boolean): Reward {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'prize': !exists(json, 'prize') ? undefined : json['prize'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'points': !exists(json, 'points') ? undefined : json['points'],
        'startAt': !exists(json, 'start_at') ? undefined : json['start_at'],
        'endAt': !exists(json, 'end_at') ? undefined : json['end_at'],
    };
}

export function RewardToJSON(value?: Reward | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'prize': value.prize,
        'description': value.description,
        'points': value.points,
        'start_at': value.startAt,
        'end_at': value.endAt,
    };
}

