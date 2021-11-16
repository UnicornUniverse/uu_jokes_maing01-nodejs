import UU5 from "uu5g04";

export const About = {
  about: {
    cs: "UuJokes je referenční aplikace pro vzdělávací účely.",
    en: "UuJokes is reference application for educational purposes.",
  },
  licence: {
    termsOfUse: "https://unicorn.com/tou/your_product",
    organisation: {
      cs: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/",
      },
      en: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/",
      },
    },
    authorities: {
      cs: [
        {
          name: "Vladimír Kovář",
          uri: "https://www.unicorn.com/",
        },
      ],
      en: [
        {
          name: "Vladimír Kovář",
          uri: "https://www.unicorn.com/",
        },
      ],
    },
  },
  leadingAuthors: [
    {
      name: "Vladimír Kovář",
      uuIdentity: "1-1",
      role: {
        en: "Chief Business Architect & Stakeholder",
      },
    },
    {
      name: "David Kimr",
      uuIdentity: "2-1",
      role: {
        en: "UAF Authority & Supervision",
      },
    },
    {
      name: "Marek Štastný",
      uuIdentity: "11-1",
      role: {
        en: "UAF Authority & Supervision",
      },
    },
    {
      name: "Radek Dolejš",
      uuIdentity: "4-1",
      role: {
        en: "Evangelist Hub Manager",
      },
    },
    {
      name: "Klára Hniličková",
      uuIdentity: "13-2340-1",
      role: {
        en: "Educational Materials Family Manager",
      },
    },
  ],
  otherAuthors: [
    {
      name: "Martin Farkaš",
      uuIdentity: "6565-1",
      role: {
        en: "Developer",
      },
    },
    {
      name: "Michal Husák",
      uuIdentity: "7709-1",
      role: {
        en: "UX Designer",
      },
    },
    {
      name: "Petr Příhoda",
      uuIdentity: "21-7222-1",
      role: {
        en: "Developer",
      },
    },
    {
      name: "Ladislav Kašša",
      uuIdentity: "6399-5018-1",
      role: {
        en: "Developer",
      },
    },
    {
      name: "Simona Klučková",
      uuIdentity: "4891-4363-1",
      role: {
        en: "Designer",
      },
    },
  ],
  usedTechnologies: {
    technologies: {
      en: [
        <UU5.Bricks.LinkUAF key="uaf" />,
        <UU5.Bricks.LinkUuApp key="uuapp" />,
        <UU5.Bricks.LinkUU5 key="uu5" />,
        <UU5.Bricks.LinkUuPlus4U5 key="uuplus4u5" />,
        <UU5.Bricks.Link
          content="uuProductCatalogue"
          href="https://uuapp.plus4u.net/uu-bookkit-maing01/7f743efd1bf6486d8e72b27a0df92ba7/book"
          target="_blank"
          key="uuproductcatalogue"
        />,
        <UU5.Bricks.LinkUuAppServer key="uuappserver" />,
        <UU5.Bricks.LinkUuOIDC key="uuoidc" />,
        <UU5.Bricks.LinkUuCloud key="uucloud" />,
      ],
    },
    content: {
      cs: [
        `<uu5string/>Dále byly použity technologie: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>,
        <UU5.Bricks.LinkReact/> a <UU5.Bricks.LinkDocker/>.
        Aplikace je provozována v rámci internetové služby <UU5.Bricks.LinkPlus4U/> s využitím cloudu <UU5.Bricks.LinkMSAzure/>.`,
      ],
      en: [
        `<uu5string/>Other used technologies: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>,
        <UU5.Bricks.LinkReact/> a <UU5.Bricks.LinkDocker/>.`,
        `<uu5string/>Application is operated in the <UU5.Bricks.LinkPlus4U/> internet service with the usage of <UU5.Bricks.LinkMSAzure/> cloud.`
      ]
    },
  },
};

export default About;
