/* =============================================================================
   Ela — topic taxonomy (single source of truth)
   -----------------------------------------------------------------------------
   The five areas and the topics under them, from the "Updated Topics" map.
   Every screen that links a log to a topic, themes a conversation by one, or
   groups an archive by one reads this file — the taxonomy drifted across four
   places before (theme.css tokens, topic-tag.css modifiers, chat-history chips,
   and the /api/ela-chat title enum), so it lives in one now.

   `id` is the token name the design system already ships — `--fg-topic-<id>`,
   `.topic-tag--<id>`, and the API's enum all key off it. `label` is what a
   person reads, which is NOT always the id: the map says Healthcare, the token
   is `health`; the map says Fun, the token is `games`. Keep the ids.

   Not in any area: `general` and `logs`. Those are system buckets (an untagged
   conversation, the Logs surface itself), not things a person picks.
   ============================================================================= */
(function (global) {
  'use strict';

  const AREAS = [
    { id: 'earn',  label: 'Earn',  topics: ['business', 'investing', 'budgeting'] },
    { id: 'learn', label: 'Learn', topics: ['studies', 'work-better', 'language'] },
    { id: 'care',  label: 'Care',  topics: ['fitness', 'cooking', 'health', 'nutrition'] },
    { id: 'love',  label: 'Love',  topics: ['family', 'friendship', 'dating', 'relationship'] },
    { id: 'play',  label: 'Play',  topics: ['travel', 'games', 'gaming'] }
  ];

  /* Only the topics whose reading differs from their token id. */
  const LABELS = {
    'health':       'Healthcare',
    'relationship': 'Relationships',
    'games':        'Fun',
    'work-better':  'Work Better'
  };

  const ICONS = {
    business: 'buildings',   investing: 'money-bill-trend-up', budgeting: 'hand-holding-dollar',
    studies: 'sparkles',     'work-better': 'brain',           language: 'earth-americas',
    fitness: 'dumbbell',     cooking: 'hat-chef',              health: 'heart-pulse',
    nutrition: 'utensils',   family: 'people-group',           friendship: 'users',
    dating: 'fire',          relationship: 'heart',            travel: 'plane',
    games: 'face-laugh-squint', gaming: 'gamepad-modern',
    general: 'message',      logs: 'scroll'
  };

  /* One illustration per topic, so a log linked to any topic gets its band. */
  const ILLO = {
    business: 'bg_business.jpg',   investing: 'bg_investing.jpg', budgeting: 'bg_budgeting.jpg',
    studies: 'bg_studies.jpg',     'work-better': 'bg_work_better.jpg', language: 'bg_language.jpg',
    fitness: 'bg_fitness.jpg',     cooking: 'bg_cooking.jpg',     health: 'bg_healthcare.jpg',
    nutrition: 'bg_nutrition.jpg', family: 'bg_family.jpg',       friendship: 'bg_friendship.jpg',
    dating: 'bg_dating.jpg',       relationship: 'bg_relationship.jpg', travel: 'bg_travel.jpg',
    games: 'bg_fun.jpg',           gaming: 'bg_gaming.jpg',
    general: 'bg_logs.jpg',        logs: 'bg_logs.jpg'
  };

  /* Offline / failed-call fallback: three prompts per topic, so a declared
     topic still gets topic-relevant starters when the model cannot answer.
     The live set is better — these only have to be not-wrong. */
  const STARTERS = {
    business:      ['Where do I start?', 'Is this idea any good?', 'How do others do it?'],
    investing:     ['Is now a good time?', 'How much is enough?', 'What are the risks?'],
    budgeting:     ['Where does it all go?', 'How do I spend less?', 'Help me plan a month'],
    studies:       ['How do I focus?', 'Best way to revise?', 'I keep procrastinating'],
    'work-better': ['How do I stay focused?', 'Too much on my plate', 'Beating the 3pm slump'],
    language:      ['How do I practise?', 'Common mistakes?', 'Help me sound natural'],
    fitness:       ['Where do I start?', 'How often is enough?', 'I have no energy'],
    cooking:       ['What can I cook?', 'Quick weeknight meals', 'How do I meal prep?'],
    health:        ['Is this normal?', 'When should I worry?', 'How do I feel better?'],
    nutrition:     ['What should I eat?', 'Any foods to avoid?', 'Am I missing anything?'],
    family:        ['How do I bring it up?', 'We keep arguing', 'Making more time'],
    friendship:    ['How do I reconnect?', 'Making new friends', 'Setting boundaries'],
    dating:        ['What do I say first?', 'Am I reading this right?', 'When to be honest'],
    relationship:  ['How do I bring it up?', 'We keep arguing', 'Keeping it fresh'],
    travel:        ['Where should I go?', 'How do I plan it?', 'Doing it for less'],
    games:         ['What should I try?', 'Something to play tonight', 'Games for two'],
    gaming:        ['What should I play?', 'How do I get better?', 'Worth the time?'],
    general:       ['Tell me more', 'What should I know?', 'Anything I am missing?'],
    logs:          ['Tell me more', 'What should I know?', 'Anything I am missing?']
  };

  function titleCase(id) {
    return id.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());
  }

  const api = {
    AREAS: AREAS,
    ICONS: ICONS,
    ILLO: ILLO,
    /** Every topic id, in area order. */
    all: () => AREAS.reduce((acc, a) => acc.concat(a.topics), []),
    /** Reading for a topic or an area id. Falls back to title case. */
    label: id => LABELS[id] || (AREAS.find(a => a.id === id) || {}).label || titleCase(id),
    /** Topics under an area, or [] for an unknown/absent area. */
    topicsIn: areaId => (AREAS.find(a => a.id === areaId) || { topics: [] }).topics,
    /** The area a topic belongs to, or null if it is a system bucket. */
    areaOf: topicId => (AREAS.find(a => a.topics.indexOf(topicId) !== -1) || {}).id || null,
    icon: id => ICONS[id] || 'tag',
    /** Fallback prompts for a topic, as [icon, label] pairs. */
    starters: id => (STARTERS[id] || STARTERS.general).map(l => [ICONS[id] || 'message', l]),
    illo: id => ILLO[id] || ILLO.logs
  };

  global.ElaTopics = api;
})(window);
