// Applique le correctif exFAT (readlink EISDIR -> EINVAL) avant tout le reste.
require("./exfat-fs-patch");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ce projet est stocké sur un volume exFAT, où fs.readlink() renvoie EISDIR
    // sur des fichiers normaux. La résolution des symlinks de webpack (activée
    // par défaut) échoue alors avec une erreur "EISDIR ... readlink". exFAT ne
    // gère pas les liens symboliques, on peut donc la désactiver sans risque.
    config.resolve.symlinks = false;
    // Le cache fichier de webpack fait lui aussi des readlink (snapshots) qui
    // échouent sur exFAT ; on le désactive pour ce volume.
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
