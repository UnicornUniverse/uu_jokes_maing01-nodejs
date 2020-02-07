import UU5 from "uu5g04";

export const About = {
  licence: {
    organisation: {
      cs: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/"
      },
      en: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/"
      }
    },
    authorities: {
      cs: [
        {
          name: "Vladimír Kovář",
          uri: "https://www.unicorn.com/"
        }
      ],
      en: [
        {
          name: "Vladimír Kovář",
          uri: "https://www.unicorn.com/"
        }
      ]
    }
  },
  leadingAuthors: [
    {
      name: "Vladimír Kovář",
      uuIdentity: "1-1",
      role: {
        en: "Chief Business Architect & Stakeholder"
      }
    },
    {
      name: "Radek Dolejš",
      uuIdentity: "4-1",
      role: {
        en: "Product Manager"
      }
    },
    {
      name: "Lucie Melounová",
      uuIdentity: "3-5444-1",
      role: {
        en: "Designer"
      }
    },
    {
      name: "Milan Martinek",
      uuIdentity: "6-138-1",
      role: {
        en: "Developer"
      }
    }
  ],
  otherAuthors: [
    {
      name: "David Kimr",
      uuIdentity: "2-1",
      role: {
        en: "UAF Authority & Supervision"
      }
    },
    {
      name: "Marek Štastný",
      uuIdentity: "11-1",
      role: {
        en: "UAF Authority & Supervision"
      }
    },
    {
      name: "Klára Hniličková",
      uuIdentity: "13-2340-1",
      role: {
        en: "Designer"
      }
    },
    {
      name: "Michal Husák",
      uuIdentity: "7709-1",
      role: {
        en: "UX Designer"
      }
    },
    {
      name: "Petr Bartoš",
      uuIdentity: "192-168-0000-1",
      role: {
        en: "Developer"
      }
    },
    {
      name: "Václav Pruner",
      uuIdentity: "12-9488-1",
      role: {
        en: "Developer"
      }
    },
    {
      name: "Mykhaylo Komarichyn",
      uuIdentity: "11-8571-1",
      role: {
        en: "Developer"
      }
    }
  ],
  usedTechnologies: {
    technologies: {
      en: [
        <UU5.Bricks.LinkUAF />,
        <UU5.Bricks.LinkUuApp />,
        <UU5.Bricks.LinkUU5 />,
        <UU5.Bricks.LinkUuPlus4U5 />,
        <UU5.Bricks.Link
          content="uuProductCatalogue"
          href="https://uuapp.plus4u.net/uu-bookkit-maing01/7f743efd1bf6486d8e72b27a0df92ba7/book"
          target="_blank"
        />,
        <UU5.Bricks.LinkUuAppServer />,
        <UU5.Bricks.LinkUuOIDC />,
        <UU5.Bricks.LinkUuCloud />
      ]
    },
    content: {
      cs: [
        `<uu5string/>Dále byly použity technologie: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>, <UU5.Bricks.LinkMaterialDesign/>,
        <UU5.Bricks.LinkReact/> a <UU5.Bricks.LinkDocker/>.
        Aplikace je provozována v rámci internetové služby <UU5.Bricks.LinkPlus4U/> s využitím cloudu <UU5.Bricks.LinkMSAzure/>.
        Technickou dokumentaci lze nalézt v knize <UU5.Bricks.Link href="https://uuapp.plus4u.net/uu-bookkit-maing01/71f8d7b5cfdc4336b0abfe47b3cb237b/book" target="_blank" content='uuJokesg01' />.`
      ],
      en: [
        `<uu5string/>Other used technologies: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>, <UU5.Bricks.LinkMaterialDesign/>,
        <UU5.Bricks.LinkReact/> a <UU5.Bricks.LinkDocker/>.
        Application is operated in the <UU5.Bricks.LinkPlus4U/> internet service with the usage of <UU5.Bricks.LinkMSAzure/> cloud.
        Technical documentation can be found in <UU5.Bricks.Link href="https://uuapp.plus4u.net/uu-bookkit-maing01/71f8d7b5cfdc4336b0abfe47b3cb237b/book" target="_blank" content='uuJokesg01' />.`
      ]
    }
  }
};

export default About;
