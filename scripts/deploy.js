// Script de deploy FTP a Hostinger
// Carga .env.deploy, conecta al servidor FTP y sube la carpeta out/

import * as ftp from "basic-ftp";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, "..");

// Cargar variables desde .env.deploy
dotenv.config({ path: path.join(raiz, ".env.deploy") });

const { FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR } = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASS || !FTP_REMOTE_DIR) {
  console.error("ERROR: Faltan variables en .env.deploy.");
  process.exit(1);
}

const carpetaLocal = path.join(raiz, "out");

async function deploy() {
  const cliente = new ftp.Client();
  cliente.ftp.verbose = false; // cambiar a true para depurar

  console.log(`\n🚀 Iniciando deploy a ${FTP_HOST}...`);

  try {
    await cliente.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false, // Hostinger usa FTP simple en puerto 21
    });

    console.log("✓ Conectado al servidor FTP.");

    // Vaciar el directorio remoto de destino
    console.log(`⚠️  Limpiando ${FTP_REMOTE_DIR}...`);
    await cliente.cd(FTP_REMOTE_DIR);
    await cliente.clearWorkingDir();
    console.log("✓ Directorio remoto limpiado.");

    // Subir todo el contenido de out/ a FTP_REMOTE_DIR
    console.log(`📤 Subiendo archivos desde out/ a ${FTP_REMOTE_DIR}...`);
    await cliente.uploadFromDir(carpetaLocal, FTP_REMOTE_DIR);

    console.log("\n✅ Deploy completado con éxito.");
    console.log("   Sitio disponible en: https://promptoma.com\n");
  } catch (error) {
    console.error("\n❌ Error durante el deploy:", error);
    process.exit(1);
  } finally {
    cliente.close();
  }
}

deploy();
