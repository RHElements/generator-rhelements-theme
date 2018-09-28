const Generator = require("yeoman-generator");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");
const packageJson = require("../package.json");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your theme name"
      },
      {
        type: "input",
        name: "author",
        message: "Author name"
      },
      {
        type: "list",
        name: "useSass",
        message: "Do you want to use Sass with this theme?",
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      }
    ]).then(answers => {
      let name = answers.name.split("-")[1];

      const { version: rhelementVersion } = require(this.destinationPath(
        "rhelement/package.json"
      ));

      this.props = {
        author: answers.author,
        name: answers.name,
        themeName: answers.name,
        themeClassName: _.chain(answers.name)
          .camelCase()
          .upperFirst()
          .value(),
        readmeName: _.upperFirst(name),
        lowerCaseName: name,
        camelCaseName: _.camelCase(answers.name),
        useSass: answers.useSass,
        generatorRhelementsThemeVersion: packageJson.version,
        rhelementVersion
      };

      mkdirp.sync(this.props.themeName);
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath(`${this.props.themeName}/package.json`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("src/theme.js"),
      this.destinationPath(
        `${this.props.themeName}/src/${this.props.themeName}.js`
      ),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath(`${this.props.themeName}/README.md`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("gulpfile.js"),
      this.destinationPath(`${this.props.themeName}/gulpfile.js`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath("rollup.config.js"),
      this.destinationPath(`${this.props.themeName}/rollup.config.js`),
      this.props
    );

    this.fs.copy(
      this.templatePath(".*"),
      this.destinationPath(`${this.props.themeName}`)
    );

    this.fs.copy(
      this.templatePath("apply-shim.*"),
      this.destinationPath(`${this.props.themeName}`)
    );

    this.fs.copy(
      this.templatePath("custom-style-interface.*"),
      this.destinationPath(`${this.props.themeName}`)
    );

    this.fs.copy(
      this.templatePath("scoping-shim.*"),
      this.destinationPath(`${this.props.themeName}`)
    );

    this.fs.copy(
      this.templatePath("LICENSE.txt"),
      this.destinationPath(`${this.props.themeName}/LICENSE.txt`)
    );

    if (this.props.useSass) {
      this.fs.copyTpl(
        this.templatePath("src/themeName.scss"),
        this.destinationPath(
          `${this.props.themeName}/src/${this.props.themeName}.scss`
        ),
        this.props
      );

      this.fs.copy(
        this.templatePath("src/sass/*"),
        this.destinationPath(`${this.props.themeName}/src/sass/`)
      );

    } else {
      this.fs.copy(
        this.templatePath("src/themeName.css"),
        this.destinationPath(
          `${this.props.themeName}/src/${this.props.themeName}.css`
        )
      );
    }
  }

  install() {
    process.chdir(this.props.themeName);

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }

  end() {
    this.spawnCommand("npm", ["run", "build"]);
  }
};
