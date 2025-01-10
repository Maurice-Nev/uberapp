import Image from "next/image";
import React from "react";

export const Homepage: React.FC = () => {
  return (
    <main className="flex flex-col items-center gap-16 p-8 ">
      {/* Header Section */}
      <section className="text-center max-w-2xl md:pt-16">
        <h1 className="text-4xl font-bold mb-4">
          Willkommen bei deiner Mitfahrerzentrale!
        </h1>
        <p className="text-lg text-gray-700">
          Diese App verbindet Schüler, um unkompliziert und sicher
          Mitfahrgelegenheiten zur Schule zu finden oder anzubieten. Erfahre
          mehr über die Vorteile und die einfache Handhabung!
        </p>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Was die App für dich tut
        </h2>
        <ul className="flex flex-col md:flex-row gap-8 justify-center">
          <li className="w-full md:w-80  border rounded-xl p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Fahrten suchen</h3>
            <p className="text-gray-600">
              Finde schnell und unkompliziert eine Mitfahrgelegenheit zur
              Schule.
            </p>
          </li>
          <li className="w-full md:w-80  border rounded-xl p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Fahrten anbieten</h3>
            <p className="text-gray-600">
              Biete eine Fahrt an und finde Mitfahrer aus deinem Umfeld.
            </p>
          </li>
          <li className="w-full md:w-80  border rounded-xl p-8 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Schüler vernetzen</h3>
            <p className="text-gray-600">
              Teile Fahrten, treffe Freunde und sorge für eine nachhaltige
              Anreise zur Schule.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Homepage;
