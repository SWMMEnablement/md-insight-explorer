import { DissertationViewer } from '@/components/DissertationViewer';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Urban Rainfall/Runoff Modelling - Allan Goyen PhD Thesis</title>
        <meta name="description" content="Spatial and temporal effects on urban rainfall/runoff modelling - A comprehensive PhD dissertation by Allan Goyen from the University of Technology, Sydney (2000)" />
        <meta name="keywords" content="urban hydrology, rainfall runoff modeling, stormwater management, catchment analysis, hydrological modeling" />
        <meta property="og:title" content="Urban Rainfall/Runoff Modelling Research" />
        <meta property="og:description" content="Detailed analysis of spatial and temporal effects on urban rainfall/runoff modelling with data visualizations and background information" />
      </Helmet>
      <DissertationViewer />
    </>
  );
};

export default Index;
