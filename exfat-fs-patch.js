// Correctif exFAT : sur ce système de fichiers, fs.readlink() renvoie EISDIR
// pour des fichiers/dossiers normaux (non-liens), alors que Next.js et webpack
// attendent EINVAL ("ce n'est pas un lien symbolique") pour continuer sans erreur.
// On intercepte donc readlink (sync, callback et promesse) pour transformer
// EISDIR -> EINVAL. Aucun effet sur NTFS (le cas EISDIR ne s'y produit pas).
const fs = require("fs");

function toEinval(err) {
  if (err && err.code === "EISDIR") {
    err.code = "EINVAL";
    err.errno = -22;
  }
  return err;
}

const origSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = function (...args) {
  try {
    return origSync(...args);
  } catch (err) {
    throw toEinval(err);
  }
};

const origCb = fs.readlink.bind(fs);
fs.readlink = function (path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }
  return origCb(path, options, function (err, result) {
    callback(toEinval(err), result);
  });
};

if (fs.promises && fs.promises.readlink) {
  const origP = fs.promises.readlink.bind(fs.promises);
  fs.promises.readlink = function (...args) {
    return origP(...args).catch((err) => {
      throw toEinval(err);
    });
  };
}
