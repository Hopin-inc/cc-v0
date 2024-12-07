export type ContributionTypeFormState = {
  name: string;
  value: string;
  point: number;
};

export const initialContributionTypeFormState: ContributionTypeFormState = {
  name: "",
  value: "",
  point: 0,
};

export const createContributionTypeFormFromType = (
  type: any
): ContributionTypeFormState => ({
  name: type.name,
  value: type.value,
  point: type.point,
});
