export const HiddenServiceKeywords = { profile: 'HIDDENSERVICE_PROFILE', port: 'HIDDENSERVICE_PORT', namespace: 'HIDDENSERVICE_NAMESPACE' };

export type HiddenServiceIdentifier = {
	hostname: string;
	profile: string;
	namespace?: string;
	port?: number;
};
