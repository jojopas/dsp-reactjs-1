const sendToGoogleAnalytics = (obj) => {
    const {action, label, category, nonInteraction, value} = obj;

    if (window && window.gtag) {
        gtag('event', action || 'view', {
            event_label: label || '',
            event_category: category || 'Misc',
            non_interaction: nonInteraction || true,
            value: value || undefined,
        });
    }
};

module.exports = {
    sendToGoogleAnalytics
};
