/**
 * Constantes partagées entre le widget de chat (client) et l'API (serveur),
 * calibrées pour rester dans les limites d'une offre gratuite (tokens maîtrisés).
 */

/** Longueur maximale d'un message utilisateur, en caractères. */
export const MAX_MESSAGE_LENGTH = 1000;

/**
 * Nombre maximal de messages d'historique transmis au modèle à chaque requête.
 * On ne garde que les plus récents pour borner la consommation de tokens.
 */
export const MAX_HISTORY_MESSAGES = 12;
