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
import type { LearningPath } from './LearningPath';
import {
    LearningPathFromJSON,
    LearningPathFromJSONTyped,
    LearningPathToJSON,
} from './LearningPath';
import type { Researcher } from './Researcher';
import {
    ResearcherFromJSON,
    ResearcherFromJSONTyped,
    ResearcherToJSON,
} from './Researcher';
import type { Stage } from './Stage';
import {
    StageFromJSON,
    StageFromJSONTyped,
    StageToJSON,
} from './Stage';

/**
 * 
 * @export
 * @interface BaseStudy
 */
export interface BaseStudy {
    /**
     * The study name that participants see.
     * @type {string}
     * @memberof BaseStudy
     */
    titleForParticipants?: string;
    /**
     * The study name that only researchers see.
     * @type {string}
     * @memberof BaseStudy
     */
    titleForResearchers?: string;
    /**
     * A short study description.
     * @type {string}
     * @memberof BaseStudy
     */
    shortDescription?: string;
    /**
     * A long study description.
     * @type {string}
     * @memberof BaseStudy
     */
    longDescription?: string;
    /**
     * An internal study description for researchers.
     * @type {string}
     * @memberof BaseStudy
     */
    internalDescription?: string;
    /**
     * Freeform id of image that should be displayed on study card
     * @type {string}
     * @memberof BaseStudy
     */
    imageId?: string;
    /**
     * Description of how the study benefits participants
     * @type {string}
     * @memberof BaseStudy
     */
    benefits?: string;
    /**
     * Is this study featured?
     * @type {boolean}
     * @memberof BaseStudy
     */
    readonly isFeatured?: boolean;
    /**
     * Is this study highlighted?
     * @type {boolean}
     * @memberof BaseStudy
     */
    readonly isHighlighted?: boolean;
    /**
     * Is the study hidden from participants
     * @type {boolean}
     * @memberof BaseStudy
     */
    isHidden?: boolean;
    /**
     * Did the participant consent
     * @type {boolean}
     * @memberof BaseStudy
     */
    readonly consented?: boolean;
    /**
     * When the study was launched; null means not launched
     * @type {Date}
     * @memberof BaseStudy
     */
    readonly firstLaunchedAt?: Date;
    /**
     * When the study opens for participation; null means not open.
     * @type {Date}
     * @memberof BaseStudy
     */
    opensAt?: Date | null;
    /**
     * When the study closes for participation; null means does not close.
     * @type {Date}
     * @memberof BaseStudy
     */
    closesAt?: Date | null;
    /**
     * Desired sample size set by researcher
     * @type {number}
     * @memberof BaseStudy
     */
    targetSampleSize?: number | null;
    /**
     * Status of the study
     * @type {string}
     * @memberof BaseStudy
     */
    readonly status?: BaseStudyStatusEnum;
    /**
     * The study's researchers.
     * @type {Array<Researcher>}
     * @memberof BaseStudy
     */
    researchers?: Array<Researcher>;
    /**
     * How many times the study has been viewed
     * @type {number}
     * @memberof BaseStudy
     */
    viewCount?: number;
    /**
     * When the study becomes public for sharing with other researchers.
     * @type {Date}
     * @memberof BaseStudy
     */
    publicOn?: Date | null;
    /**
     * Number of times this study has been completed
     * @type {number}
     * @memberof BaseStudy
     */
    readonly completedCount?: number;
    /**
     * The category (type of) study
     * @type {string}
     * @memberof BaseStudy
     */
    category?: string;
    /**
     * 
     * @type {LearningPath}
     * @memberof BaseStudy
     */
    learningPath?: LearningPath;
    /**
     * The study's subject
     * @type {string}
     * @memberof BaseStudy
     */
    subject?: string;
    /**
     * The study's stages.
     * @type {Array<Stage>}
     * @memberof BaseStudy
     */
    stages?: Array<Stage>;
    /**
     * How many times the study has been launched
     * @type {number}
     * @memberof BaseStudy
     */
    readonly launchedCount?: number;
    /**
     * The URL to which stages should return after completing
     * @type {string}
     * @memberof BaseStudy
     */
    readonly returnUrl?: string;
}


/**
 * @export
 */
export const BaseStudyStatusEnum = {
    Active: 'active',
    Paused: 'paused',
    Scheduled: 'scheduled',
    Draft: 'draft',
    WaitingPeriod: 'waiting_period',
    ReadyForLaunch: 'ready_for_launch',
    Completed: 'completed'
} as const;
export type BaseStudyStatusEnum = typeof BaseStudyStatusEnum[keyof typeof BaseStudyStatusEnum];


/**
 * Check if a given object implements the BaseStudy interface.
 */
export function instanceOfBaseStudy(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BaseStudyFromJSON(json: any): BaseStudy {
    return BaseStudyFromJSONTyped(json, false);
}

export function BaseStudyFromJSONTyped(json: any, ignoreDiscriminator: boolean): BaseStudy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'titleForParticipants': !exists(json, 'title_for_participants') ? undefined : json['title_for_participants'],
        'titleForResearchers': !exists(json, 'title_for_researchers') ? undefined : json['title_for_researchers'],
        'shortDescription': !exists(json, 'short_description') ? undefined : json['short_description'],
        'longDescription': !exists(json, 'long_description') ? undefined : json['long_description'],
        'internalDescription': !exists(json, 'internal_description') ? undefined : json['internal_description'],
        'imageId': !exists(json, 'image_id') ? undefined : json['image_id'],
        'benefits': !exists(json, 'benefits') ? undefined : json['benefits'],
        'isFeatured': !exists(json, 'is_featured') ? undefined : json['is_featured'],
        'isHighlighted': !exists(json, 'is_highlighted') ? undefined : json['is_highlighted'],
        'isHidden': !exists(json, 'is_hidden') ? undefined : json['is_hidden'],
        'consented': !exists(json, 'consented') ? undefined : json['consented'],
        'firstLaunchedAt': !exists(json, 'first_launched_at') ? undefined : (new Date(json['first_launched_at'])),
        'opensAt': !exists(json, 'opens_at') ? undefined : (json['opens_at'] === null ? null : new Date(json['opens_at'])),
        'closesAt': !exists(json, 'closes_at') ? undefined : (json['closes_at'] === null ? null : new Date(json['closes_at'])),
        'targetSampleSize': !exists(json, 'target_sample_size') ? undefined : json['target_sample_size'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'researchers': !exists(json, 'researchers') ? undefined : ((json['researchers'] as Array<any>).map(ResearcherFromJSON)),
        'viewCount': !exists(json, 'view_count') ? undefined : json['view_count'],
        'publicOn': !exists(json, 'public_on') ? undefined : (json['public_on'] === null ? null : new Date(json['public_on'])),
        'completedCount': !exists(json, 'completed_count') ? undefined : json['completed_count'],
        'category': !exists(json, 'category') ? undefined : json['category'],
        'learningPath': !exists(json, 'learning_path') ? undefined : LearningPathFromJSON(json['learning_path']),
        'subject': !exists(json, 'subject') ? undefined : json['subject'],
        'stages': !exists(json, 'stages') ? undefined : ((json['stages'] as Array<any>).map(StageFromJSON)),
        'launchedCount': !exists(json, 'launched_count') ? undefined : json['launched_count'],
        'returnUrl': !exists(json, 'return_url') ? undefined : json['return_url'],
    };
}

export function BaseStudyToJSON(value?: BaseStudy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title_for_participants': value.titleForParticipants,
        'title_for_researchers': value.titleForResearchers,
        'short_description': value.shortDescription,
        'long_description': value.longDescription,
        'internal_description': value.internalDescription,
        'image_id': value.imageId,
        'benefits': value.benefits,
        'is_hidden': value.isHidden,
        'opens_at': value.opensAt === undefined ? undefined : (value.opensAt === null ? null : value.opensAt.toISOString()),
        'closes_at': value.closesAt === undefined ? undefined : (value.closesAt === null ? null : value.closesAt.toISOString()),
        'target_sample_size': value.targetSampleSize,
        'researchers': value.researchers === undefined ? undefined : ((value.researchers as Array<any>).map(ResearcherToJSON)),
        'view_count': value.viewCount,
        'public_on': value.publicOn === undefined ? undefined : (value.publicOn === null ? null : value.publicOn.toISOString()),
        'category': value.category,
        'learning_path': LearningPathToJSON(value.learningPath),
        'subject': value.subject,
        'stages': value.stages === undefined ? undefined : ((value.stages as Array<any>).map(StageToJSON)),
    };
}

