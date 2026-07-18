import siteJson from '../data/site.json';
import projectsJson from '../data/projects.json';
import friendsJson from '../data/friends.json';
import goalsJson from '../data/goals.json';
import techJson from '../data/tech.json';
import { getSortedPostsData, getPostById, getAllTags } from './posts';
import type { PostData } from './posts';
import type { ProjectConfig, FriendLink } from '../config/site';

export const siteData = siteJson;
export const projects: ProjectConfig[] = projectsJson;
export const friends: FriendLink[] = friendsJson;
export const goals = goalsJson;
export const tech = techJson;

export const posts: PostData[] = getSortedPostsData();
export { getPostById, getAllTags };
