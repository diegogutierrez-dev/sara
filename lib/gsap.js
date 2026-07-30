import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

/* Punto único de registro de plugins: importar gsap siempre desde aquí. */
gsap.registerPlugin(Flip, useGSAP);

export { gsap, Flip, useGSAP };
