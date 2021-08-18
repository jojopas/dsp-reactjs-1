## Sports TV

### Deployment Link

    https://sportstv.herokuapp.com/

-   ##### To run the development server with NPM:

```bash
npm install
npm run dev
```

> _If errors with NPM, check that all required dependencies are being installed. I had to manually run:_

```bash
npm install --save react
npm install --save react-dom
npm install --save next
```

##### To run the development server with YARN:

```bash
yarn dev
```

#### Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit files.

### Environment Variables

| Variable                 |                                                                                                      | Default                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| DSP_API_URL              |                                                                                                      | 'api.myspotlight.tv'                       |
| DSP_API_KEY              |                                                                                                      | 'f36c883f5037af539572f2d1a362573bb683c727' |
| DSP_PLAYER_KEY           | staging: '5ef5185b8949063e3a66d133' prod: '5ef4a47fc27512184b7d2b62'                                 | '5ef4a47fc27512184b7d2b62'                 |
| DSP_PLAYER_URL           | prod: 'https://www.dplayer.pro/dotplayer.js'                                                         | 'https://www.dplayer.pro/dotplayer.js'     |
| GA_ID                    | staging: 'UA-84268486-6' prod: 'UA-84268486-2'                                                       | 'UA-84268486-6'                            |
| SEGMENT_WRITE_KEY        | qa: 'pJOFZYQaXKgw4QwFLgCcX3lwcPHRSnBB' prod: 'JiuzpzcYrsdlvAVEWW9vedGw3dXqyZ5V'                      | 'pJOFZYQaXKgw4QwFLgCcX3lwcPHRSnBB'         |
| APP_VERSION              |                                                                                                      | '0.0.0'                                    |
| GOOGLE_RECAPTCHA_SITEKEY |                                                                                                      | '6Lc5WT0aAAAAAK1o9PAW59s700x_adV7pgiyUC2F' |
