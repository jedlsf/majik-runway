

/**
 * Sends an event to Google Analytics using gtag.
 *
 * @param eventCategory - The category of the event (e.g., "engagement").
 * @param eventLabel - The label for the event (e.g., "Hero_Section_Book_Session_Now").
 * @param value - Optional value associated with the event (e.g., 1).
 */
export const trackEvent = (
    eventCategory: string,
    eventLabel: string,
    value?: number
): void => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'event_action', {
            event_category: eventCategory,
            event_label: eventLabel,
            value: value || 0, // Default value is 0 if not provided
        });
    }
};
