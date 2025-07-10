import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, BrainCircuit, Droplets, Sun, Moon, Briefcase, CheckCircle, Target, BookOpen, Gem, Star, Zap, Plus, X, Shield, AlertTriangle, Clock, Lightbulb, UserCheck, Map, Search, Wand2, Sparkles, TrendingUp, TrendingDown, Users, Utensils, Wrench, ShoppingCart, Home, Zap as EnergyIcon, Wind, Meh, Settings, Upload, Download } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    orderBy
} from 'firebase/firestore';


// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- COMPONENTES DE UI ---
const Card = ({ children, className = '' }) => (<div className={`bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-6 ${className}`}>{children}</div>);
const SectionTitle = ({ icon, title }) => (<h2 className="text-xl font-bold text-white mb-4 flex items-center">{React.cloneElement(icon, { className: "text-purple-400 w-6 h-6" })}<span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{title}</span></h2>);
const Modal = ({ children, onClose }) => (<div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" onClick={onClose}><div className="bg-gray-900 border border-purple-500 rounded-lg p-6 shadow-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>{children}</div></div>);

// --- COMPONENTES CON LÓGICA ---

const ErrorModal = ({ message, onClose }) => ( <Modal onClose={onClose}> <div className="text-center"> <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" /> <h2 className="text-xl font-bold text-white mb-2">Error de Configuración</h2> <p className="text-gray-300">{message}</p> <button onClick={onClose} className="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"> Entendido </button> </div> </Modal> );

const SettingsManager = ({ configData, onConfigChange }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const newConfig = JSON.parse(e.target.result);
                    onConfigChange(newConfig);
                    alert("Configuración actualizada correctamente.");
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert("Error: El archivo de configuración no es un JSON válido.");
                }
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, selecciona un archivo JSON válido.");
        }
    };

    const handleDownloadConfig = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "zenith_os_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <Card>
            <SectionTitle icon={<Settings />} title="Configuración" />
            <p className="text-sm text-gray-400 mb-4">Carga o descarga tu configuración base (estrategia, iniciativas, gastos fijos).</p>
            <div className="space-y-3">
                <label htmlFor="config-upload" className="w-full text-center cursor-pointer bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Cargar Configuración
                </label>
                <input id="config-upload" type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                <button onClick={handleDownloadConfig} className="w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Actual
                </button>
            </div>
        </Card>
    );
};

const SleepCycleCalculator = () => {
    const [wakeUpTimes, setWakeUpTimes] = useState([]);
    const calculateWakeUpTimes = (bedtime) => { const fallAsleepTime = new Date(bedtime.getTime() + 15 * 60000); const times = []; for (let i = 4; i <= 6; i++) { const wakeUpTime = new Date(fallAsleepTime.getTime() + i * 90 * 60000); times.push({ cycles: i, time: wakeUpTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), hours: Math.floor(i*1.5), minutes: (i*1.5 % 1) * 60 }); } setWakeUpTimes(times); };
    useEffect(() => { const defaultBedtime = new Date(); defaultBedtime.setHours(23, 0, 0, 0); calculateWakeUpTimes(defaultBedtime); }, []);
    const handleBedtimeSelection = (hours, minutes) => { const newBedtime = new Date(); newBedtime.setHours(hours, minutes, 0, 0); calculateWakeUpTimes(newBedtime); }
    return (<Card><SectionTitle icon={<Clock />} title="Calculadora de Sueño" /><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"><button onClick={() => handleBedtimeSelection(22, 0)} className="bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-colors">10 PM</button><button onClick={() => handleBedtimeSelection(23, 0)} className="bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-colors">11 PM</button><button onClick={() => handleBedtimeSelection(0, 0)} className="bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-colors">12 AM</button><button onClick={() => handleBedtimeSelection(1, 0)} className="bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-colors">1 AM</button></div><div><h4 className="font-semibold text-white mb-2">Despierta a una de estas horas:</h4><ul className="space-y-2">{wakeUpTimes.map((item, index) => (<li key={index} className={`p-3 rounded-lg flex justify-between items-center ${index === 1 ? 'bg-purple-600/50 border border-purple-500' : 'bg-white/5'}`}><span className="text-xl font-bold text-white">{item.time}</span><div className="text-right"><span className="font-semibold text-purple-300">{item.cycles} Ciclos</span><p className="text-xs text-gray-400">{item.hours}h {item.minutes}min</p></div></li>))}</ul></div></Card>);
};

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25); const [seconds, setSeconds] = useState(0); const [isActive, setIsActive] = useState(false); const [isBreak, setIsBreak] = useState(false); const [showModal, setShowModal] = useState(false); const [modalMessage, setModalMessage] = useState('');
  const CustomAlert = ({ message, onClose }) => (<Modal onClose={onClose}><div className="text-center"><h2 className="text-xl font-bold text-white mb-2">Pomodoro</h2><p className="text-gray-300">{message}</p><button onClick={onClose} className="mt-6 bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">OK</button></div></Modal>);
  useEffect(() => { let interval = null; if (isActive) { interval = setInterval(() => { if (seconds > 0) { setSeconds(s => s - 1); } if (seconds === 0) { if (minutes === 0) { clearInterval(interval); setIsActive(false); if (isBreak) { setModalMessage("¡El descanso ha terminado! Volvamos al trabajo."); setShowModal(true); setMinutes(25); setIsBreak(false); } else { setModalMessage("¡Tiempo de un descanso! Buen trabajo."); setShowModal(true); setMinutes(5); setIsBreak(true); } } else { setMinutes(m => m - 1); setSeconds(59); } } }, 1000); } return () => clearInterval(interval); }, [isActive, seconds, minutes, isBreak]);
  const toggle = () => setIsActive(!isActive); const reset = () => { setIsActive(false); setIsBreak(false); setMinutes(25); setSeconds(0); };
  return (<><Card className="text-center"><SectionTitle icon={<Target />} title="Foco Pomodoro" /><div className="text-7xl font-mono text-white my-4 tracking-tighter">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div><div className="space-x-4"><button onClick={toggle} className={`px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'}`}>{isActive ? 'Pausa' : 'Inicio'}</button><button onClick={reset} className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 font-semibold text-white transition-colors">Reset</button></div><p className="text-sm text-purple-300 mt-3">{isBreak ? "En descanso..." : "Sesión de trabajo"}</p></Card>{showModal && <CustomAlert message={modalMessage} onClose={() => setShowModal(false)} />}</>);
};

const DailyAlignmentModal = ({ onSave, userId }) => {
    const [focus, setFocus] = useState(''); const [mood, setMood] = useState('');
    const moods = [ { label: 'Energizado', icon: <EnergyIcon className="w-6 h-6 text-green-400" /> }, { label: 'Enfocado', icon: <BrainCircuit className="w-6 h-6 text-blue-400" /> }, { label: 'Neutral', icon: <Meh className="w-6 h-6 text-gray-400" /> }, { label: 'Cansado', icon: <Wind className="w-6 h-6 text-red-400" /> }, ];
    const handleSave = async () => { if (focus && mood && userId) { const alignmentCol = collection(db, 'users', userId, 'alignments'); await addDoc(alignmentCol, { focus, mood, date: new Date().toISOString().split('T')[0] }); onSave({ focus, mood }); } };
    return (<Modal onClose={() => {}}><h2 className="text-2xl font-bold text-white mb-4">Alineación Diaria</h2><p className="text-gray-400 mb-6">Establece tu intención para empezar el día con claridad.</p><div className="mb-6"><label className="block text-purple-300 font-semibold mb-2">¿Cuál es tu único objetivo principal para hoy?</label><input type="text" value={focus} onChange={(e) => setFocus(e.target.value)} className="bg-white/5 w-full rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: Terminar el caso de estudio..." /></div><div className="mb-8"><label className="block text-purple-300 font-semibold mb-2">¿Cómo te sientes hoy?</label><div className="grid grid-cols-4 gap-4">{moods.map(m => (<button key={m.label} onClick={() => setMood(m.label)} className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${mood === m.label ? 'bg-purple-600 ring-2 ring-pink-500' : 'bg-white/10 hover:bg-white/20'}`}>{m.icon}<span className="text-xs mt-2 text-white">{m.label}</span></button>))}</div></div><button onClick={handleSave} disabled={!focus || !mood} className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Empezar el Día</button></Modal>);
};

const DailyFocusToDo = ({ alignment, tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTaskText, setNewTaskText] = useState(''); const moodIcons = { 'Energizado': <EnergyIcon className="w-5 h-5 text-green-400" />, 'Enfocado': <BrainCircuit className="w-5 h-5 text-blue-400" />, 'Neutral': <Meh className="w-5 h-5 text-gray-400" />, 'Cansado': <Wind className="w-5 h-5 text-red-400" />, };
    const handleAddTask = (e) => { e.preventDefault(); if (newTaskText.trim()) { onAddTask(newTaskText); setNewTaskText(''); } };
    return (<Card><div className="flex justify-between items-start mb-4"><div><h3 className="text-purple-300 text-sm font-semibold">PLAN DE ACCIÓN DIARIO</h3><p className="text-white text-2xl font-bold">{alignment.focus}</p></div><div className="flex items-center text-white text-lg font-bold bg-white/10 px-3 py-1 rounded-lg">{moodIcons[alignment.mood]}<span className="ml-2 text-sm">{alignment.mood}</span></div></div><form onSubmit={handleAddTask} className="flex gap-2 mb-4"><input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="Añadir paso de acción..." className="bg-white/5 w-full rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><button type="submit" className="bg-purple-600 text-white font-semibold p-2 rounded-lg hover:bg-purple-700 transition-colors"><Plus className="w-5 h-5" /></button></form><ul className="space-y-2">{tasks.map(task => (<li key={task.id} className="flex items-center group bg-white/5 p-2 rounded-lg"><div onClick={() => onToggleTask(task.id, !task.completed)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors cursor-pointer ${task.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-500 group-hover:border-purple-400'}`}>{task.completed && <CheckCircle className="w-4 h-4 text-white" />}</div><span onClick={() => onToggleTask(task.id, !task.completed)} className={`flex-grow transition-colors cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>{task.text}</span><button onClick={() => onDeleteTask(task.id)} className="ml-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button></li>))}</ul></Card>);
};

const IncomeTracker = ({ userId, entries, onAddIncome, onDeleteIncome }) => {
    const [description, setDescription] = useState(''); const [amount, setAmount] = useState(''); const [type, setType] = useState('dev');
    const handleSubmit = (e) => { e.preventDefault(); if (description && amount > 0 && userId) { onAddIncome({ description, amount: parseFloat(amount), type, date: new Date().toISOString() }); setDescription(''); setAmount(''); } };
    const getTypePill = (incomeType) => { const styles = { dev: "bg-blue-500/20 text-blue-300", music: "bg-pink-500/20 text-pink-300" }; return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[incomeType]}`}>{incomeType}</span>; };
    return (<Card><SectionTitle icon={<TrendingUp />} title="Registro de Ingresos" /><form onSubmit={handleSubmit} className="space-y-4 mb-6"><input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="bg-white/5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><div className="flex gap-4"><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto (USD)" className="bg-white/5 w-1/2 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><select value={type} onChange={e => setType(e.target.value)} className="bg-white/5 w-1/2 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option value="dev">Desarrollo</option><option value="music">Música</option></select></div><button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors">Añadir Ingreso</button></form><div><h3 className="font-semibold text-white mb-2">Ingresos Recientes</h3><ul className="space-y-2">{entries.slice(0, 3).map(entry => (<li key={entry.id} className="bg-white/5 p-2 rounded-lg flex justify-between items-center text-sm group"><div><p className="text-white">{entry.description}</p><p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString()}</p></div><div className="flex items-center"><div className="text-right mr-4"><p className="font-bold text-green-400">${entry.amount.toFixed(2)}</p>{getTypePill(entry.type)}</div><button onClick={() => onDeleteIncome(entry.id)} className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button></div></li>))}</ul></div></Card>);
};

const ExpenseTracker = ({ userId, entries, onAddExpense, onDeleteExpense }) => {
    const [description, setDescription] = useState(''); const [amount, setAmount] = useState(''); const [category, setCategory] = useState('Herramientas');
    const categories = { Herramientas: <Wrench/>, Comida: <Utensils/>, Personal: <ShoppingCart/>, Hogar: <Home/> };
    const handleSubmit = (e) => { e.preventDefault(); if (description && amount > 0 && userId) { onAddExpense({ description, amount: parseFloat(amount), category, date: new Date().toISOString() }); setDescription(''); setAmount(''); } };
    return (<Card><SectionTitle icon={<TrendingDown />} title="Registro de Gastos" /><form onSubmit={handleSubmit} className="space-y-4 mb-6"><input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="bg-white/5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><div className="flex gap-4"><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto (USD)" className="bg-white/5 w-1/2 rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><select value={category} onChange={e => setCategory(e.target.value)} className="bg-white/5 w-1/2 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">{Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div><button type="submit" className="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-colors">Añadir Gasto</button></form><div><h3 className="font-semibold text-white mb-2">Gastos Recientes</h3><ul className="space-y-2">{entries.slice(0, 3).map(entry => (<li key={entry.id} className="bg-white/5 p-2 rounded-lg flex justify-between items-center text-sm group"><div><p className="text-white">{entry.description}</p><p className="text-xs text-gray-400">{entry.category}</p></div><div className="flex items-center"><p className="font-bold text-red-400 mr-4">${entry.amount.toFixed(2)}</p><button onClick={() => onDeleteExpense(entry.id)} className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"><X className="w-4 h-4" /></button></div></li>))}</ul></div></Card>);
};

const FinancialDashboard = ({ finances, income, expenses }) => {
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0); const totalExpenses = expenses.reduce((sum, entry) => sum + entry.amount, 0); const netProfit = totalIncome - totalExpenses; const incomeProgress = (totalIncome / finances.targetIncome) * 100;
    const expenseData = Object.entries(expenses.reduce((acc, { category, amount }) => { acc[category] = (acc[category] || 0) + amount; return acc; }, {})).map(([name, value]) => ({ name, value }));
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
    return (<Card><SectionTitle icon={<DollarSign />} title="Panel Financiero Mensual" /><div className="space-y-6"><div><h3 className="text-lg font-semibold text-white mb-2">Progreso de Ingresos</h3><div className="w-full bg-white/10 rounded-full h-4"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full" style={{ width: `${incomeProgress > 100 ? 100 : incomeProgress}%` }}></div></div><p className="text-sm text-gray-300 mt-2">${totalIncome.toLocaleString()} / ${finances.targetIncome.toLocaleString()}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-4"><h3 className="text-lg font-semibold text-white">Flujo de Caja</h3><div className="text-sm space-y-2"><div className="flex justify-between"><span>Ingresos</span><span className="font-bold text-green-400">${totalIncome.toFixed(2)}</span></div><div className="flex justify-between"><span>Gastos</span><span className="font-bold text-red-400">${totalExpenses.toFixed(2)}</span></div><div className="flex justify-between border-t border-white/20 pt-2 mt-2 font-bold text-lg"><span>Beneficio Neto</span><span className={netProfit >= 0 ? 'text-green-300' : 'text-red-300'}>${netProfit.toFixed(2)}</span></div></div></div><div><h3 className="text-lg font-semibold text-white mb-2">Desglose de Gastos</h3><ResponsiveContainer width="100%" height={120}><PieChart><Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8">{expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]} /></PieChart></ResponsiveContainer></div></div></div></Card>);
};

const ProspectsCRM = ({ userId, prospects, onAddProspect, onUpdateStatus }) => {
    const [name, setName] = useState(''); const [channel, setChannel] = useState('LinkedIn'); const statuses = ["Contactado", "En Conversación", "Propuesta Enviada", "Cliente", "Descartado"];
    const handleSubmit = (e) => { e.preventDefault(); if(name && userId) { onAddProspect({ name, channel, status: "Contactado", date: new Date().toISOString() }); setName(''); } };
    const getStatusColor = (status) => ({ "Contactado": "bg-blue-500/20 text-blue-300", "En Conversación": "bg-yellow-500/20 text-yellow-300", "Propuesta Enviada": "bg-purple-500/20 text-purple-300", "Cliente": "bg-green-500/20 text-green-300", "Descartado": "bg-red-500/20 text-red-300" }[status]);
    return (<Card><SectionTitle icon={<Users/>} title="CRM de Prospectos" /><form onSubmit={handleSubmit} className="space-y-4 mb-6"><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Prospecto" className="bg-white/5 w-full rounded-lg p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" /><div className="flex gap-4"><select value={channel} onChange={e => setChannel(e.target.value)} className="bg-white/5 w-full rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"><option>LinkedIn</option><option>Foro Gearspace</option><option>Referido</option><option>Otro</option></select></div><button type="submit" className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors">Añadir Prospecto</button></form><div><h3 className="font-semibold text-white mb-2">Lista de Prospectos</h3><ul className="space-y-2">{prospects.map(p => (<li key={p.id} className="bg-white/5 p-2 rounded-lg text-sm"><div><p className="font-bold text-white">{p.name}</p><p className="text-xs text-gray-400">{p.channel}</p></div><select value={p.status} onChange={e => onUpdateStatus(p.id, { status: e.target.value })} className={`w-full mt-2 p-1 rounded text-xs border-0 focus:ring-2 focus:ring-purple-500 ${getStatusColor(p.status)}`}><option disabled>Estado</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></li>))}</ul></div></Card>);
};

const StrategicDashboard = ({ strategy }) => (<Card className="space-y-8"><div><SectionTitle icon={<Map />} title="Plan de Transición de Carrera" /><div className="space-y-4"><div className="bg-white/5 p-4 rounded-lg"><h4 className="font-bold text-purple-300">Fase 1: Construcción (3-4h/día)</h4><p className="text-sm text-gray-300">Conseguir el primer caso de estudio de una landing page funcional, manteniendo el ingreso musical actual.</p></div><div className="bg-white/5 p-4 rounded-lg"><h4 className="font-bold text-purple-300">Fase 2: Transición</h4><p className="text-sm text-gray-300">Al alcanzar $1000/mes constantes en desarrollo web, reducir progresivamente el volumen de clientes de música.</p></div></div></div><div><SectionTitle icon={<Search />} title="Patrones Psicológicos y Soluciones" /><ul className="space-y-3 text-sm">{strategy.diagnosedPatterns.map((p, i) => (<li key={i} className="bg-white/5 p-3 rounded-lg"><p className="font-semibold text-white">{p.pattern}</p><p className="text-gray-400"><span className="font-medium text-pink-400">Causa Raíz:</span> {p.cause}</p><p className="text-gray-300"><span className="font-medium text-purple-300">Acción:</span> {p.recommendation}</p></li>))}</ul></div></Card>);
const InitiativesManager = ({ initiatives }) => {
  const getIconForType = (type) => ({'dev': <Zap className="w-5 h-5 text-yellow-400" />,'music': <Droplets className="w-5 h-5 text-blue-400" />,}[type] || <Briefcase className="w-5 h-5 text-gray-400" />);
  const getStatusChip = (status) => { const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"; const styles = { "Activo": "bg-green-500/20 text-green-300", "Fase 1": "bg-blue-500/20 text-blue-300" }; return <span className={`${baseClasses} ${styles[status]}`}>{status}</span>; }
  return (<Card><SectionTitle icon={<Briefcase className="w-6 h-6" />} title="Iniciativas Estratégicas" /><div className="space-y-6">{initiatives.map(p => (<div key={p.id} className="bg-white/5 p-4 rounded-lg transition-all hover:bg-white/10"><div className="flex justify-between items-start"><h3 className="text-lg font-semibold text-white flex items-center mb-1">{getIconForType(p.type)}<span className="ml-2">{p.name}</span></h3>{getStatusChip(p.status)}</div><p className="text-sm text-gray-400 mb-3">{p.goal}</p><ul className="space-y-2">{p.tasks.map(t => (<li key={t.id} className="flex items-center group"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors cursor-pointer ${t.completed ? 'border-purple-500 bg-purple-500' : 'border-gray-500 group-hover:border-purple-400'}`}>{t.completed && <CheckCircle className="w-4 h-4 text-white" />}</div><span className={`flex-grow transition-colors cursor-pointer ${t.completed ? 'line-through text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>{t.text}</span></li>))}</ul></div>))}</div></Card>);};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [configData, setConfigData] = useState({
      user: { name: "Usuario" },
      finances: { targetIncome: 10000, debts: [], subscriptions: [] },
      initiatives: [],
      strategy: { diagnosedPatterns: [], validatedHypotheses: [], clientArchetype: { traits: [], channels: [] } }
  });
  const [userId, setUserId] = useState(null);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [isAligned, setIsAligned] = useState(false);
  const [dailyAlignment, setDailyAlignment] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    setConfigData({
      user: { name: "Usuario" },
      finances: { targetIncome: 10000, debts: [ { id: 2, name: "Masonería (atraso)", total: 80 }, { id: 3, name: "Alquiler", total: 100 }, { id: 4, name: "Cashea (tostiarepa)", total: 33 }, ], subscriptions: [ { id: 1, name: "Splice", cost: 12.99 }, { id: 2, name: "Ozone Suite", cost: 20.00 }, { id: 3, name: "Masonería", cost: 20.00 }, ], },
      initiatives: [ { id: 1, name: "Desarrollo Web Premium", goal: "Ofrecer landing pages optimizadas por IA ($600–$1000 c/u).", type: "dev", status: "Fase 1", tasks: [{ id: 1, text: "Construir y documentar el primer caso de estudio", completed: false }, { id: 2, text: "Estudiar psicología de ventas y pricing", completed: false }]}, { id: 2, name: "Producción Musical (Modelo Kovaceski)", goal: "Mantener ingresos con clientes premium y precio fijo.", type: "music", status: "Activo", tasks: [{ id: 1, text: "Implementar y comunicar la lista de precios fija", completed: false }, { id: 2, text: "Buscar 2 nuevos clientes 'Kovaceski'", completed: false }]}, ],
      strategy: { diagnosedPatterns: [ { pattern: "Ansiedad al dar precios", cause: "Miedo al rechazo vs. autopercepción", recommendation: "Usar lista fija de precios no negociables." }, { pattern: "Procrastinación recurrente", cause: "Tareas sin retorno (financiero, artístico, ético)", recommendation: "Evaluar proyectos con costo de oportunidad real." } ], validatedHypotheses: [ "El problema no es el talento, es el pricing dictado por ansiedad.", "El arquetipo 'Kovaceski' es el cliente ideal validado.", "Fiverr limita el crecimiento y la captación de clientes premium." ], clientArchetype: { label: "Kovaceski", traits: ["Empresario exitoso con pasión artística (45-65 años)", "Busca calidad y fiabilidad, no el precio más bajo", "Colabora a distancia y valora la experiencia"], channels: ["LinkedIn (búsqueda inversa)", "Foros de gear musical de alto nivel", "Portafolio con casos de estudio"] } }
    });
  }, []);

  // Autenticación
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) { setUserId(user.uid); setAuthError(null); } 
      else { signInAnonymously(auth).catch(error => { console.error("Anonymous sign-in failed:", error); if (error.code === 'auth/configuration-not-found') { setAuthError("Error de configuración: El inicio de sesión anónimo no está habilitado en tu panel de Firebase. Por favor, ve a Authentication > Sign-in method y habilítalo."); } else { setAuthError(`Error de autenticación: ${error.message}`); } }); }
    });
  }, []);

  // Suscripciones a Firestore
  useEffect(() => {
    if (!userId) return;
    const collections = { incomeEntries: 'income', expenseEntries: 'expenses', prospects: 'prospects', dailyTasks: 'dailyTasks', alignments: 'alignments' };
    const unsubscribers = Object.entries(collections).map(([stateKey, collectionName]) => {
        const q = query(collection(db, 'users', userId, collectionName), orderBy('date', 'desc'));
        return onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (stateKey === 'incomeEntries') setIncomeEntries(items);
            else if (stateKey === 'expenseEntries') setExpenseEntries(items);
            else if (stateKey === 'prospects') setProspects(items);
            else if (stateKey === 'dailyTasks') { const todayStr = new Date().toISOString().split('T')[0]; const todayTasks = items.filter(t => t.date === todayStr); setDailyTasks(todayTasks); } 
            else if (stateKey === 'alignments') { const todayStr = new Date().toISOString().split('T')[0]; const todayAlignment = items.find(a => a.date === todayStr); if (todayAlignment) { setDailyAlignment(todayAlignment); setIsAligned(true); } }
        }, (error) => { console.error(`Error al escuchar la colección ${collectionName}:`, error); });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [userId]);

  const handleConfigChange = (newConfig) => { setConfigData(prevConfig => ({ ...prevConfig, ...newConfig })); };
  const handleAdd = (collectionName) => async (data) => { if(!userId) return; await addDoc(collection(db, 'users', userId, collectionName), data); };
  const handleDelete = (collectionName) => async (id) => { if(!userId) return; await deleteDoc(doc(db, 'users', userId, collectionName, id)); };
  const handleUpdate = (collectionName) => async (id, data) => { if(!userId) return; await updateDoc(doc(db, 'users', userId, collectionName, id), data); };
  const handleSaveAlignment = (alignmentData) => { handleAdd('alignments')({ ...alignmentData, date: new Date().toISOString().split('T')[0] }); handleAdd('dailyTasks')({ text: alignmentData.focus, completed: false, date: new Date().toISOString().split('T')[0] }); };
  const handleAddDailyTask = (text) => handleAdd('dailyTasks')({ text, completed: false, date: new Date().toISOString().split('T')[0] });
  const handleToggleDailyTask = (id, completed) => handleUpdate('dailyTasks')(id, { completed });
  const handleDeleteDailyTask = (id) => handleDelete('dailyTasks')(id);

  const currentMonthIncome = incomeEntries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0);
  const currentMonthExpenses = expenseEntries.filter(e => new Date(e.date).getMonth() === new Date().getMonth());

  return (
    <>
      <style>{`@keyframes move { 0% { transform: translate(0, 0); } 50% { transform: translate(200px, 100px); } 100% { transform: translate(0, 0); } } .gradient-bg { width: 100vw; height: 100vh; position: fixed; overflow: hidden; background: #0D0C1D; top: 0; left: 0; z-index: -1; } .gradient-bg > div { position: absolute; filter: blur(150px); border-radius: 50%; } .g1 { width: 400px; height: 400px; background: rgba(138, 43, 226, 0.3); animation: move 20s infinite alternate; } .g2 { width: 300px; height: 300px; background: rgba(218, 112, 214, 0.2); top: 20vh; left: 30vw; animation: move 25s infinite alternate-reverse; } .g3 { width: 250px; height: 250px; background: rgba(255, 20, 147, 0.2); top: 60vh; left: 10vw; animation: move 18s infinite alternate; } .g4 { width: 350px; height: 350px; background: rgba(75, 0, 130, 0.2); top: 50vh; left: 70vw; animation: move 22s infinite alternate-reverse; }`}</style>
      <div className="gradient-bg"><div className="g1"></div><div className="g2"></div><div className="g3"></div><div className="g4"></div></div>
      {authError && <ErrorModal message={authError} onClose={() => setAuthError(null)} />}
      {!isAligned && !authError && <DailyAlignmentModal onSave={handleSaveAlignment} userId={userId} />}
      <div className="min-h-screen text-gray-200 font-sans relative">
        <div className={`container mx-auto p-4 sm:p-6 lg:p-8 transition-opacity duration-500 ${isAligned ? 'opacity-100' : 'opacity-0'}`}>
          <header className="mb-8 text-center"><h1 className="text-4xl md:text-5xl font-bold text-white">Zenith OS</h1><p className="text-purple-300 text-lg">Tu centro de comando estratégico.</p></header>
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8">
              <IncomeTracker userId={userId} entries={incomeEntries} onAddIncome={handleAdd('income')} onDeleteIncome={handleDelete('income')} />
              <ExpenseTracker userId={userId} entries={expenseEntries} onAddExpense={handleAdd('expenses')} onDeleteExpense={handleDelete('expenses')} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              {isAligned && <DailyFocusToDo alignment={dailyAlignment} tasks={dailyTasks} onAddTask={handleAddDailyTask} onToggleTask={handleToggleDailyTask} onDeleteTask={handleDeleteDailyTask} />}
              <FinancialDashboard finances={configData.finances} income={incomeEntries} expenses={currentMonthExpenses} />
              <StrategicDashboard strategy={configData.strategy} />
            </div>
            <div className="lg:col-span-1 space-y-8">
              <ProspectsCRM userId={userId} prospects={prospects} onAddProspect={handleAdd('prospects')} onUpdateStatus={handleUpdate('prospects')} />
              <InitiativesManager initiatives={configData.initiatives} />
              <PomodoroTimer />
              <SleepCycleCalculator />
              <SettingsManager configData={configData} onConfigChange={handleConfigChange} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
