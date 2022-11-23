import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { LabelValueOption, Form, Input } from "react-hook-form-components";
import * as yup from "yup";

it("select works", () => {
  const name = faker.random.alpha(10);
  const schema = yup.object().shape({
    [name]: yup.string(),
  });

  const options = faker.helpers.uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 3);
  const randomOption = faker.helpers.arrayElement(options);

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")} resolver={yupResolver(schema)}>
      <Input inputType="select" name={name} label={name} options={options} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`select[id=${name}]`).select(randomOption.label);
  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledOnceWith", { [name]: randomOption.value });
});

it("select multiple works", () => {
  const name = faker.random.alpha(10);

  const options = faker.helpers
    .uniqueArray<LabelValueOption>(() => ({ value: faker.random.alpha(10), label: faker.random.alpha(10) }), 10)
    .sort((a, b) => a.label.localeCompare(b.label));
  const randomOptions = faker.helpers.arrayElements(options).sort((a, b) => a.label.localeCompare(b.label));

  cy.mount(
    <Form onSubmit={cy.spy().as("onSubmitSpy")}>
      <Input inputType="select" multiple name={name} label={name} options={options} />

      <input type={"submit"} />
    </Form>,
  );

  cy.get(`select[id=${name}]`).select(randomOptions.map((option) => option.label));

  cy.get("input[type=submit]").click({ force: true });

  cy.get("@onSubmitSpy").should("be.calledWithMatch", { [name]: randomOptions.map((option) => option.value) });
});
