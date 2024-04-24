module.exports = {
  eslint: {
    dirs: ["src", "lib"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,
            dimensions: false,
          },
        },
      ],
    });

    return config;
  },
};
