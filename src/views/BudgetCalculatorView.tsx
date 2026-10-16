import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  IndianRupee,
  Bus,
  Coffee,
  Ticket,
  Building,
  ShieldAlert,
  Percent,
  Download,
  Printer,
  Sparkles,
  Users,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';

export const BudgetCalculatorView: React.FC = () => {
  const { showToast } = useApp();

  // Interactive state
  const [studentCount, setStudentCount] = useState<number>(45);
  const [facultyCount, setFacultyCount] = useState<number>(3);
  const [transportCost, setTransportCost] = useState<number>(22000);
  const [foodPerHead, setFoodPerHead] = useState<number>(280);
  const [entryFeePerStudent, setEntryFeePerStudent] = useState<number>(100);
  const [accommodationPerHead, setAccommodationPerHead] = useState<number>(0);
  const [miscCost, setMiscCost] = useState<number>(3500);
  const [facultyDA, setFacultyDA] = useState<number>(1000);
  const [contingencyRate, setContingencyRate] = useState<number>(8);
  const [collegeSubsidyPercent, setCollegeSubsidyPercent] = useState<number>(20);

  // Actual expenditure simulation for comparison
  const [actualTransport, setActualTransport] = useState<number>(21500);
  const [actualFood, setActualFood] = useState<number>(12800);
  const [actualEntry, setActualEntry] = useState<number>(4500);
  const [actualMisc, setActualMisc] = useState<number>(2900);

  // Computations
  const totalHeads = studentCount + facultyCount;
  const totalFoodCost = totalHeads * foodPerHead;
  const totalEntryCost = studentCount * entryFeePerStudent;
  const totalAccommodation = totalHeads * accommodationPerHead;
  const totalFacultyAllowance = facultyCount * facultyDA;

  const baseSubtotal =
    transportCost +
    totalFoodCost +
    totalEntryCost +
    totalAccommodation +
    miscCost +
    totalFacultyAllowance;

  const contingencyAmount = Math.round((baseSubtotal * contingencyRate) / 100);
  const grossTotal = baseSubtotal + contingencyAmount;

  const collegeSubsidyAmount = Math.round((grossTotal * collegeSubsidyPercent) / 100);
  const netStudentPayableTotal = Math.max(0, grossTotal - collegeSubsidyAmount);

  const costPerStudentGross = Math.round(grossTotal / studentCount);
  const costPerStudentNet = Math.round(netStudentPayableTotal / studentCount);
  const costPerFaculty = Math.round(facultyDA + (foodPerHead + accommodationPerHead));

  // Actuals total
  const actualTotal = actualTransport + actualFood + actualEntry + actualMisc;
  const budgetVariance = grossTotal - actualTotal;

  const handlePrintQuotation = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Interactive Industrial Tour Budget Calculator
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Live Real-Time Model
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Simulate transportation, refreshments, college subsidies, and contingency reserves with instant cost-per-student calculation.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrintQuotation}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Formal Quotation
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Estimated Budget
          </span>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
            ₹{grossTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            For {studentCount} students + {facultyCount} faculty
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-xs">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Student Fee (Payable)
          </span>
          <div className="text-3xl font-black text-blue-950 mt-2 font-mono">
            ₹{costPerStudentNet.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-600 mt-1">
            After {collegeSubsidyPercent}% institutional grant
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 shadow-xs">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            College Grant Subsidized
          </span>
          <div className="text-3xl font-black text-teal-950 mt-2 font-mono">
            ₹{collegeSubsidyAmount.toLocaleString()}
          </div>
          <p className="text-[11px] text-teal-600 mt-1">
            Sanctioned from Academic Fund
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 shadow-xs">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Cost Per Faculty
          </span>
          <div className="text-3xl font-black text-purple-950 mt-2 font-mono">
            ₹{costPerFaculty.toLocaleString()}
          </div>
          <p className="text-[11px] text-purple-600 mt-1">
            Daily Allowance & Meals
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs Left, Comparison Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" /> Quotation Parameters
            </h3>
            <span className="text-xs text-slate-400">All numbers recalculate dynamically</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Student & Faculty counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Students</label>
                <input
                  type="number"
                  min={1}
                  value={studentCount}
                  onChange={(e) => setStudentCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Chaperones</label>
                <input
                  type="number"
                  min={1}
                  value={facultyCount}
                  onChange={(e) => setFacultyCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Transport & Food */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bus Hire & Fuel Package (₹ Total)
                </label>
                <input
                  type="number"
                  step={500}
                  value={transportCost}
                  onChange={(e) => setTransportCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meals & Refreshments (₹ / Head)
                </label>
                <input
                  type="number"
                  step={20}
                  value={foodPerHead}
                  onChange={(e) => setFoodPerHead(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Entry Passes & Misc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lab Entry / Demo Pass (₹ / Student)
                </label>
                <input
                  type="number"
                  step={50}
                  value={entryFeePerStudent}
                  onChange={(e) => setEntryFeePerStudent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  First Aid, Mementos & Misc (₹)
                </label>
                <input
                  type="number"
                  step={500}
                  value={miscCost}
                  onChange={(e) => setMiscCost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Contingency slider & Subsidy Slider */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Safety Contingency Buffer:</span>
                  <span className="text-blue-700 font-mono">{contingencyRate}% (₹{contingencyAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={contingencyRate}
                  onChange={(e) => setContingencyRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>College Institutional Grant (Subsidy):</span>
                  <span className="text-teal-700 font-mono">{collegeSubsidyPercent}% (₹{collegeSubsidyAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={collegeSubsidyPercent}
                  onChange={(e) => setCollegeSubsidyPercent(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown Table & Actual Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Detailed Ledger */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Estimated Line Item Ledger</h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 text-slate-600">Transit Coach Rental</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{transportCost.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600">
                      Catering & Meals ({totalHeads} heads)
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{totalFoodCost.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600">
                      Lab Entry Passes ({studentCount} students)
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{totalEntryCost.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600">Faculty DA Allowance</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{totalFacultyAllowance.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-600">First Aid & Contingency ({contingencyRate}%)</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{contingencyAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td className="p-3 text-slate-900">Gross Expenditure</td>
                    <td className="p-3 text-right font-mono text-sm text-blue-700">
                      ₹{grossTotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-teal-800">Less: College Subsidy</td>
                    <td className="p-3 text-right font-mono text-teal-800">
                      -₹{collegeSubsidyAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-blue-50 text-blue-950 font-black">
                    <td className="p-3">Student Payable Pool</td>
                    <td className="p-3 text-right font-mono text-base">
                      ₹{netStudentPayableTotal.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actual vs Estimated Comparison */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Actual Expenditure Variance</h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Audit Reconciliation
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Total Estimated Budget:</span>
                <span className="font-mono font-bold text-slate-900">₹{grossTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Actual Post-Tour Invoices:</span>
                <span className="font-mono font-bold text-emerald-700">₹{actualTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-950 font-bold">
                <span>Budget Variance (Savings):</span>
                <span className="font-mono">+₹{Math.max(0, budgetVariance).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
