// width of the column on mobile
export const ColumnMobileQueries = `
  @media screen and (max-width: 768px) {
    & {
      width: 500px;
    }
  }
  @media screen and (max-width: 600px) {
    & {
      width: 420px;
    }
  }
  @media screen and (max-width: 550px) {
    & {
      width: 400px;
    }
  }
  @media screen and (max-width: 425px) {
    & {
      width: 100%;
      min-width: 300px;
      padding: 0.5rem;
    }
  }
`;

// height of the image preview container
export const ImagePreviewContainerQueries = `
  @media screen and (min-width: 1200px) {
    & {
      height: 300px;
    }
  }
  @media screen and (min-width: 1024px) {
    & {
      height: 250px;
    }
  }
  @media screen and (max-width: 1024px) {
    & {
      height: 350px;
    }
  }
  @media screen and (max-width: 768px) {
    & {
      height: 300px;
    }
  }
  @media screen and (max-width: 600px) {
    & {
      height: 250px;
    }
  }
  @media screen and (max-width: 550px) {
    & {
      height: 200px;
    }
  }
`;
