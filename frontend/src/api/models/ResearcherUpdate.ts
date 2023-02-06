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
 * @interface ResearcherUpdate
 */
export interface ResearcherUpdate {
    /**
     * The researcher's ID.
     * @type {number}
     * @memberof ResearcherUpdate
     */
    id?: number;
    /**
     * The researcher's user ID.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    userId?: string;
    /**
     * The researcher's name.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    name?: string;
    /**
     * The researcher's avatar URL.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    avatarUrl?: string;
    /**
     * The researcher's avatar.
     * @type {Blob}
     * @memberof ResearcherUpdate
     */
    avatar?: Blob;
    /**
     * The researcher's institution.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    institution?: string;
    /**
     * The researcher's bio.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    bio?: string;
    /**
     * The researcher's lab page.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    labPage?: string;
    /**
     * The researcher's interest (1).
     * @type {string}
     * @memberof ResearcherUpdate
     */
    researchInterest1?: string;
    /**
     * The researcher's interest (2).
     * @type {string}
     * @memberof ResearcherUpdate
     */
    researchInterest2?: string;
    /**
     * The researcher's interest (3).
     * @type {string}
     * @memberof ResearcherUpdate
     */
    researchInterest3?: string;
    /**
     * The researcher's invite code.
     * @type {string}
     * @memberof ResearcherUpdate
     */
    inviteCode?: string;
}

/**
 * Check if a given object implements the ResearcherUpdate interface.
 */
export function instanceOfResearcherUpdate(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ResearcherUpdateFromJSON(json: any): ResearcherUpdate {
    return ResearcherUpdateFromJSONTyped(json, false);
}

export function ResearcherUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResearcherUpdate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'userId': !exists(json, 'user_id') ? undefined : json['user_id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'avatarUrl': !exists(json, 'avatar_url') ? undefined : json['avatar_url'],
        'avatar': !exists(json, 'avatar') ? undefined : json['avatar'],
        'institution': !exists(json, 'institution') ? undefined : json['institution'],
        'bio': !exists(json, 'bio') ? undefined : json['bio'],
        'labPage': !exists(json, 'lab_page') ? undefined : json['lab_page'],
        'researchInterest1': !exists(json, 'research_interest_1') ? undefined : json['research_interest_1'],
        'researchInterest2': !exists(json, 'research_interest_2') ? undefined : json['research_interest_2'],
        'researchInterest3': !exists(json, 'research_interest_3') ? undefined : json['research_interest_3'],
        'inviteCode': !exists(json, 'invite_code') ? undefined : json['invite_code'],
    };
}

export function ResearcherUpdateToJSON(value?: ResearcherUpdate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'user_id': value.userId,
        'name': value.name,
        'avatar_url': value.avatarUrl,
        'avatar': value.avatar,
        'institution': value.institution,
        'bio': value.bio,
        'lab_page': value.labPage,
        'research_interest_1': value.researchInterest1,
        'research_interest_2': value.researchInterest2,
        'research_interest_3': value.researchInterest3,
        'invite_code': value.inviteCode,
    };
}

