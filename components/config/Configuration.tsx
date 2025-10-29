
import React, { useState } from 'react';
import { FuelPrices, Attendant, Tank, Pump, OtherProduct } from '../../types';
import PricesConfig from './PricesConfig';
import AttendantsConfig from './AttendantsConfig';
import TanksConfig from './TanksConfig';
import PumpsConfig from './PumpsConfig';
import OtherProductsConfig from './OtherProductsConfig';

interface ConfigurationProps {
  prices: FuelPrices;
  onPricesChange: (prices: FuelPrices) => void;
  attendants: Attendant[];
  onAttendantsChange: React.Dispatch<React.SetStateAction<Attendant[]>>;
  tanks: Tank[];
  onTanksChange: React.Dispatch<React.SetStateAction<Tank[]>>;
  pumps: Pump[];
  onPumpsChange: React.Dispatch<React.SetStateAction<Pump[]>>;
  otherProducts: OtherProduct[];
  onOtherProductsChange: React.Dispatch<React.SetStateAction<OtherProduct[]>>;
}

type ConfigTab = 'prices' | 'attendants' | 'tanks' | 'pumps' | 'products';

const Configuration: React.FC<ConfigurationProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('prices');

  const tabClass = (tabName: ConfigTab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ease-in-out ${
      activeTab === tabName
        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('prices')} className={tabClass('prices')}>Prix Carburants</button>
          <button onClick={() => setActiveTab('attendants')} className={tabClass('attendants')}>Pompistes</button>
          <button onClick={() => setActiveTab('tanks')} className={tabClass('tanks')}>Cuves</button>
          <button onClick={() => setActiveTab('pumps')} className={tabClass('pumps')}>Pistolets</button>
          <button onClick={() => setActiveTab('products')} className={tabClass('products')}>Autres Produits</button>
        </nav>
      </div>
      <div className="mt-6">
        {activeTab === 'prices' && <PricesConfig prices={props.prices} onPricesChange={props.onPricesChange} />}
        {activeTab === 'attendants' && <AttendantsConfig attendants={props.attendants} onAttendantsChange={props.onAttendantsChange} />}
        {activeTab === 'tanks' && <TanksConfig tanks={props.tanks} onTanksChange={props.onTanksChange} />}
        {activeTab === 'pumps' && <PumpsConfig pumps={props.pumps} onPumpsChange={props.onPumpsChange} tanks={props.tanks} />}
        {activeTab === 'products' && <OtherProductsConfig products={props.otherProducts} onProductsChange={props.onOtherProductsChange} />}
      </div>
    </div>
  );
};

export default Configuration;
