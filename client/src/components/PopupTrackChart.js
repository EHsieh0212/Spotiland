import { useEffect } from 'react';
import Chart from 'chart.js/auto'
import styled from 'styled-components/macro';


////////////////////////////////////
// styled component
const properties = [
    'acousticness',
    'danceability',
    'energy',
    'liveness',
    'speechiness',
    'valence',
];

const Container = styled.div`
`;


////////////////////////////////////
// main component
const PopupTrackChart = ({ features }) => {

    useEffect(() => {
        const createDataset = features => {
            const dataset = {};
            properties.forEach(prop => {
                dataset[prop] = features[prop];
            });
            return dataset;
        };

        const createChart = dataset => {
            const ctx = document.getElementById('chart');
            const labels = Object.keys(dataset);
            const data = Object.values(dataset);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.4)',
                                'rgba(255, 159, 64, 0.4)',
                                'rgba(255, 206, 86, 0.4)',
                                'rgba(75, 192, 192, 0.4)',
                                'rgba(54, 162, 235, 0.4)',
                                'rgba(104, 132, 245, 0.4)',
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(104, 132, 245, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Audio Features`,
                            font: {
                                size: 30,
                                weight: 900
                            },
                            color: '#CFD8D8',
                            padding: 10,
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        };

        const parseData = () => {
            const dataset = createDataset(features);
            createChart(dataset);
        };

        parseData();
    }, []);

    return (
        <Container />
    );
};



export default PopupTrackChart;