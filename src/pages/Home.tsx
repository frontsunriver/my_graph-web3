import React, { useEffect } from 'react'
import { Alert, Link } from '@chakra-ui/react';

import { SuspenseSpinner } from '../components/SuspenseSpinner';

interface HomeProps {

}

const Home: React.FC<HomeProps> = ({}) => {
    const applyCss = () => {
        setTimeout(() => {
            const host = (document as any)?.querySelector("coingecko-coin-compare-chart-widget")?.shadowRoot;
            if(host == null || host.querySelector(".highcharts-background") == null){
                applyCss()
                return;
            }
            var sheet = new CSSStyleSheet
            host.adoptedStyleSheets = [ sheet ];
            host.querySelector(".cg-container .cg-widget .cg-absolute").style.display = "none";
            host.querySelector("style").innerHTML += `
                .highcharts-credits,
                .highcharts-scrollbar,
                .highcharts-title, 
                .highcharts-subtitle, 
                .highcharts-exporting-group,
                .highcharts-range-selector-group{display:none!important;}
                .highcharts-yaxis-grid .highcharts-grid-line{stroke:#201b40!important;}
                .highcharts-series path{stroke:#3907ff!important;fill:none!important;stroke-width:1px!important}
                .highcharts-tick{stroke:#3907ff!important;fill:none!important;stroke-width:1px!important}
                .highcharts-axis-line,
                .highcharts-plot-lines-0 path{stroke:none!important;fill:none!important;stroke-width:0!important}
                .highcharts-background{fill:none!important;}
                .highcharts-button-pressed rect{fill:#d02fb6!important;}
                .highcharts-axis-labels text{fill:#453e68!important}
                .highcharts-halo{fill:#3907ff!important}
                .highcharts-crosshair{stroke:#3907ff!important}
                .highcharts-markers > *{stroke:none!important}
                .highcharts-markers > *{fill:#3907ff!important}
                .highcharts-tooltip-box > *:not(text){fill:#201b40!important;stroke:none;!important;}
                .highcharts-tooltip-box > text{fill:#aba1ca!important;stroke:none!important;}
                .highcharts-tooltip-box > text tspan:last-child{fill:#aba1ca!important;stroke:none!important;}
            `;
        }, 10)

        setTimeout(() => {
            const property = (document as any).querySelector('.grph')
            if (property != null) {
                property.style.opacity = 1;
            }
        }, 1000)
    }
    useEffect(() => {
        let vendor = document.createElement("script")
        vendor.src = 'https://widgets.coingecko.com/coingecko-coin-compare-chart-widget.js'
        document.body.appendChild(vendor)
        applyCss()
    }, [])
    return (
        <>
            <h1>
                Price Monitoring
                <Link href="https://analytics.graphlinq.io/" to="/app/templates" className="bt">
                    Go to Analytics <i className="fal fa-arrow-right"></i>
                </Link>
            </h1>
            <div className="load">
               <SuspenseSpinner/>
            </div>
            <div className="grph" dangerouslySetInnerHTML={{
                __html: '<h2>Graphlinq Protocol • <strong>GLQ</strong></h2><coingecko-coin-compare-chart-widget coin-ids="graphlinq-protocol" currency="usd" locale="us"></coingecko-coin-compare-chart-widget>'
            }}></div>
        </>
    );
}

export default Home;