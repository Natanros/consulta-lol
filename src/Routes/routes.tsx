import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import ChampionDetail from '../Pages/ChampionDetail';
import Items from '../Pages/Items';
import Dashboard from '../Pages/Dashboard';
import WeeklyRotation from '../Pages/WeeklyRotation';
import WeeklyRotationSimple from '../Pages/WeeklyRotationSimple';
import SummonerLookup from '../Pages/SummonerLookup';
import APIDebug from '../Pages/APIDebug';
import TestNetwork from '../Pages/TestNetwork';
import SimpleRotation from '../Pages/SimpleRotation';
import SimpleSummoner from '../Pages/SimpleSummoner';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/champion/:championId" element={<ChampionDetail />} />
      <Route path="/items" element={<Items />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weekly-rotation" element={<SimpleRotation />} />
      <Route path="/summoner-lookup" element={<SimpleSummoner />} />
      <Route path="/weekly-rotation-simple" element={<WeeklyRotationSimple />} />
      <Route path="/weekly-rotation-full" element={<WeeklyRotation />} />
      <Route path="/summoner-lookup-full" element={<SummonerLookup />} />
      <Route path="/api-debug" element={<APIDebug />} />
      <Route path="/test-network" element={<TestNetwork />} />
    </Routes>
  );
};

export default AppRoutes;