/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Info,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  MapPin,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';

const PuskesmasLogo = ({ className = "w-6 h-6", fillColor = "currentColor" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
    <polygon points="60,8 112,38 112,98 60,128 8,98 8,38" fill="none" stroke={fillColor} strokeWidth="12" strokeLinejoin="round"/>
    <path d="M42,28 V46 H20 V74 H42 V92 H68 V74 H90 V46 H68 V28 Z" fill={fillColor} />
    <path d="M42,70 L72,46 L108,70 L108,82 L72,56 L42,80 Z" fill="#fff" />
    <circle cx="67" cy="74" r="6" fill="none" stroke="#fff" strokeWidth="3" />
    <circle cx="77" cy="74" r="6" fill="none" stroke="#fff" strokeWidth="3" />
  </svg>
);

// Types
type Step = 'landing' | 'screening' | 'result' | 'education';

interface ScreeningData {
  name: string;
  age: string;
  maritalStatus: string;
  phone: string;
  address: string;
  sexuallyActive: boolean | null;
  earlySexualActivity: boolean | null; // hubungan seksual < 20 tahun
  multiplePartners: boolean | null; // anda atau suami memiliki > 1 pasangan seksual
  multipara: boolean | null; // multiparitas (>3 kali melahirkan)
  earlyFirstBirth: boolean | null; // melahirkan anak pertama < 20 tahun
  hormonalContraception: boolean | null; // kontrasepsi hormonal jangka panjang (>5 tahun)
  smokingExposure: boolean | null; // merokok atau sering terpapar asap rokok
  hivStatus: boolean | null; // status imun (hiv)
  symptoms: string[];
  lastTest: string;
  willingToIva: boolean | null; // bersedia dilakukan pemeriksaan iva
}

const SYMPTOMS = [
  { id: 'bleeding_intercourse', label: 'Keluar darah setelah berhubungan suami istri' },
  { id: 'bleeding_between', label: 'Keluar darah di luar waktu haid/menstruasi' },
  { id: 'discharge', label: 'Keputihan yang berbau, gatal, atau berubah warna' },
  { id: 'pelvic_pain', label: 'Nyeri di area panggul atau nyeri saat berhubungan suami istri' },
  { id: 'none', label: 'Tidak ada keluhan di atas' },
];

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [screeningStep, setScreeningStep] = useState(0);
  const [data, setData] = useState<ScreeningData>({
    name: '',
    age: '',
    maritalStatus: '',
    phone: '',
    address: '',
    sexuallyActive: null,
    earlySexualActivity: null,
    multiplePartners: null,
    multipara: null,
    earlyFirstBirth: null,
    hormonalContraception: null,
    smokingExposure: null,
    hivStatus: null,
    symptoms: [],
    lastTest: '',
    willingToIva: null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const startScreening = () => {
    setStep('screening');
    setScreeningStep(0);
  };

  const handleNext = () => {
    if (screeningStep < 5) {
      setScreeningStep(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (screeningStep > 0) {
      setScreeningStep(prev => prev - 1);
    } else {
      setStep('landing');
    }
  };

  const toggleSymptom = (id: string) => {
    if (id === 'none') {
      setData(prev => ({ ...prev, symptoms: ['none'] }));
      return;
    }

    setData(prev => {
      const newSymptoms = prev.symptoms.includes(id)
        ? prev.symptoms.filter(s => s !== id)
        : [...prev.symptoms.filter(s => s !== 'none'), id];
      return { ...prev, symptoms: newSymptoms };
    });
  };

  const getRiskLevel = () => {
    const hasSymptoms = data.symptoms.length > 0 && !data.symptoms.includes('none');

    if (hasSymptoms) return 'symptoms';
    
    if (data.maritalStatus === 'married' || data.maritalStatus === 'divorced' || data.sexuallyActive) {
      return 'active';
    }
    
    return 'inactive';
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-white text-text-main font-sans selection:bg-secondary selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border h-[70px] flex items-center">
        <div className="max-w-[1200px] w-full mx-auto px-10 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setStep('landing')}
          >
            <PuskesmasLogo className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-primary leading-none">SIPAKAR</span>
              <span className="text-[10px] sm:text-xs font-bold text-text-light leading-none mt-1">Skrining IVA Perempuan Pakuan Baru</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-main">
            <button onClick={() => setStep('landing')} className="hover:text-primary transition-colors">Beranda</button>
            <button onClick={() => setStep('education')} className="hover:text-primary transition-colors">Informasi IVA</button>
            <button
              onClick={startScreening}
              className="bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-all font-semibold"
            >
              Mulai Skrining
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-10 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              <button onClick={() => { setStep('landing'); setIsMenuOpen(false); }}>Beranda</button>
              <button onClick={() => { setStep('education'); setIsMenuOpen(false); }}>Informasi IVA</button>
              <button
                onClick={() => { startScreening(); setIsMenuOpen(false); }}
                className="bg-primary text-white p-4 rounded-2xl text-center font-bold"
              >
                Mulai Skrining
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1200px] mx-auto px-10 py-10">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              <div className="relative w-full aspect-[4/3] md:order-1 order-2 mt-4 md:mt-0">
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-4 border-white">
                  <img 
                    src="/uterus_hands.png" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    alt="Proteksi Rahim"
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
                

              </div>

              <div className="space-y-6 md:order-2 order-1 px-4 md:px-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-primary text-xs font-bold uppercase tracking-wider border border-primary/10">
                  <Activity className="w-4 h-4" />
                  Deteksi Dini Menyelamatkan Nyawa
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tighter text-[#1A1A24] uppercase">
                  Lindungi Diri Karena Anda Berarti
                </h1>
                <p className="text-lg md:text-xl text-text-light leading-relaxed max-w-lg font-medium">
                  Lakukan skrining mandiri secara dini untuk mengetahui risiko Anda dan dapatkan rekomendasi pemeriksaan IVA yang tepat.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={startScreening}
                    className="group bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                  >
                    Mulai Skrining
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setStep('education')}
                    className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-border bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-text-main"
                  >
                    Info IVA
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-border/50">
                  <div className="flex -space-x-2 shrink-0">
                    {[1,2,3].map(i => (
                      <img 
                        key={i}
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                        alt="User"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-light flex-1 min-w-[200px]">
                    <span className="font-bold text-[#1A1A24]">10,000+</span> wanita telah melakukan skrining mandiri
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'screening' && (
            <motion.div
              key="screening"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-[1fr_320px] gap-8 items-start"
            >
              <div className="bg-white rounded-2xl border border-border shadow-md flex flex-col overflow-hidden">
                <div className="p-8 md:p-10 border-b border-border">
                  <div className="flex gap-3 mb-6">
                    {[0, 1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${s < screeningStep ? 'bg-success' :
                          s === screeningStep ? 'bg-primary' : 'bg-secondary'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-text-light text-xs uppercase font-bold tracking-wider">
                    Langkah {screeningStep + 1} dari 6: {
                      screeningStep === 0 ? 'Data Diri' :
                        screeningStep === 1 ? 'Riwayat Hubungan' :
                          screeningStep === 2 ? 'Riwayat Kesehatan' :
                            screeningStep === 3 ? 'Keluhan Saat Ini' :
                              screeningStep === 4 ? 'Riwayat Pemeriksaan' : 'Rencana Pemeriksaan'
                    }
                  </p>
                </div>

                <div className="p-8 md:p-10 min-h-[400px] flex flex-col">
                  {screeningStep === 0 && (
                    <div className="space-y-6 flex-1">
                      <h2 className="text-2xl font-bold text-primary mb-8">Data Diri</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-main">Nama Lengkap</label>
                          <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Masukkan nama Anda"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-main">Usia (Tahun)</label>
                          <input
                            type="number"
                            value={data.age}
                            onChange={(e) => setData({ ...data, age: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Contoh: 35"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-main">Status Pernikahan</label>
                          <select
                            value={data.maritalStatus}
                            onChange={(e) => setData({ ...data, maritalStatus: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                          >
                            <option value="">Pilih Status</option>
                            <option value="single">Belum Menikah</option>
                            <option value="married">Menikah</option>
                            <option value="divorced">Cerai</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-main">Nomor HP</label>
                          <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="08xxxxxxxxxx"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-bold text-text-main">Alamat Lengkap</label>
                          <textarea
                            value={data.address}
                            onChange={(e) => setData({ ...data, address: e.target.value })}
                            className="w-full p-4 rounded-2xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                            placeholder="Masukkan alamat lengkap Anda"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {screeningStep === 1 && (
                    <div className="space-y-8 flex-1">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">Apakah Anda sudah pernah berhubungan suami istri?</h2>
                        <div className="flex gap-4">
                          {[true, false].map(val => (
                            <button
                              key={String(val)}
                              onClick={() => setData({ ...data, sexuallyActive: val })}
                              className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.sexuallyActive === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                }`}
                            >
                              {val ? 'Ya, Sudah Pernah' : 'Belum Pernah'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {data.sexuallyActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-8"
                        >
                          <div className="space-y-4">
                            <p className="font-bold text-text-main">Apakah Anda pertama kali berhubungan suami istri saat usia di bawah 20 tahun?</p>
                            <div className="flex gap-4">
                              {[true, false].map(val => (
                                <button
                                  key={String(val)}
                                  onClick={() => setData({ ...data, earlySexualActivity: val })}
                                  className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.earlySexualActivity === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                    }`}
                                >
                                  {val ? 'Ya' : 'Tidak'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="font-bold text-text-main">Apakah Anda atau suami pernah memiliki pasangan lain selain pasangan saat ini?</p>
                            <div className="flex gap-4">
                              {[true, false].map(val => (
                                <button
                                  key={String(val)}
                                  onClick={() => setData({ ...data, multiplePartners: val })}
                                  className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.multiplePartners === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                    }`}
                                >
                                  {val ? 'Ya' : 'Tidak'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <p className="text-sm text-text-light italic mt-4">
                        *Pemeriksaan IVA hanya dianjurkan bagi wanita yang sudah pernah berhubungan suami istri.
                      </p>
                    </div>
                  )}

                  {screeningStep === 2 && (
                    <div className="space-y-6 flex-1">
                      <h2 className="text-2xl font-bold text-primary mb-8">Riwayat Kesehatan</h2>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <p className="font-bold text-text-main">Apakah Anda pernah melahirkan lebih dari 3 kali?</p>
                          <div className="flex gap-4">
                            {[true, false].map(val => (
                              <button
                                key={String(val)}
                                onClick={() => setData({ ...data, multipara: val })}
                                className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.multipara === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                  }`}
                              >
                                {val ? 'Ya' : 'Tidak'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-bold text-text-main">Apakah Anda melahirkan anak pertama saat usia di bawah 20 tahun?</p>
                          <div className="flex gap-4">
                            {[true, false].map(val => (
                              <button
                                key={String(val)}
                                onClick={() => setData({ ...data, earlyFirstBirth: val })}
                                className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.earlyFirstBirth === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                  }`}
                              >
                                {val ? 'Ya' : 'Tidak'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-bold text-text-main">Apakah Anda menggunakan KB hormonal (seperti pil, suntik, atau susuk/implan) lebih dari 5 tahun?</p>
                          <div className="flex gap-4">
                            {[true, false].map(val => (
                              <button
                                key={String(val)}
                                onClick={() => setData({ ...data, hormonalContraception: val })}
                                className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.hormonalContraception === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                  }`}
                              >
                                {val ? 'Ya' : 'Tidak'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-bold text-text-main">Apakah Anda merokok atau sering menghirup asap rokok di sekitar Anda (perokok pasif)?</p>
                          <div className="flex gap-4">
                            {[true, false].map(val => (
                              <button
                                key={String(val)}
                                onClick={() => setData({ ...data, smokingExposure: val })}
                                className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.smokingExposure === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                  }`}
                              >
                                {val ? 'Ya' : 'Tidak'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-bold text-text-main">Apakah Anda memiliki penyakit yang menurunkan kekebalan tubuh (seperti HIV atau penyakit kronis lainnya)?</p>
                          <div className="flex gap-4">
                            {[true, false].map(val => (
                              <button
                                key={String(val)}
                                onClick={() => setData({ ...data, hivStatus: val })}
                                className={`flex-1 p-4 rounded-2xl font-bold border-2 transition-all ${data.hivStatus === val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                  }`}
                              >
                                {val ? 'Ya' : 'Tidak'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {screeningStep === 3 && (
                    <div className="space-y-6 flex-1">
                      <h2 className="text-2xl font-bold text-primary mb-8">Apakah Anda merasakan keluhan-keluhan berikut ini?</h2>
                      <div className="space-y-3">
                        {SYMPTOMS.map(symptom => (
                          <button
                            key={symptom.id}
                            onClick={() => toggleSymptom(symptom.id)}
                            className={`w-full p-5 rounded-2xl text-left text-lg font-semibold border-2 transition-all flex items-center justify-between ${data.symptoms.includes(symptom.id)
                              ? 'border-primary bg-secondary text-primary'
                              : 'border-border hover:border-primary/30 text-text-main'
                              }`}
                          >
                            {symptom.label}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${data.symptoms.includes(symptom.id) ? 'bg-primary border-primary' : 'border-border'
                              }`}>
                              {data.symptoms.includes(symptom.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {screeningStep === 4 && (
                    <div className="space-y-6 flex-1">
                      <h2 className="text-2xl font-bold text-primary mb-8">Kapan terakhir kali Anda melakukan pemeriksaan IVA atau Pap Smear?</h2>
                      <div className="space-y-3">
                        {[
                          { id: 'never', label: 'Belum Pernah' },
                          { id: 'less_than_3', label: 'Kurang dari 3 tahun lalu' },
                          { id: '3_to_5', label: '3 - 5 tahun lalu' },
                          { id: 'more_than_5', label: 'Lebih dari 5 tahun lalu' },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setData({ ...data, lastTest: opt.id })}
                            className={`w-full p-5 rounded-2xl text-left text-lg font-semibold border-2 transition-all flex items-center justify-between ${data.lastTest === opt.id
                              ? 'border-primary bg-secondary text-primary'
                              : 'border-border hover:border-primary/30 text-text-main'
                              }`}
                          >
                            {opt.label}
                            {data.lastTest === opt.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {screeningStep === 5 && (
                    <div className="space-y-6 flex-1">
                      <h2 className="text-2xl font-bold text-primary mb-8">Rencana Pemeriksaan</h2>
                      <div className="space-y-4">
                        <p className="text-lg font-bold text-text-main">Jika nanti dianjurkan oleh petugas kesehatan, apakah Anda bersedia melakukan pemeriksaan IVA?</p>
                        <div className="flex gap-4">
                          {[
                            { val: true, label: 'Ya, Saya Bersedia' },
                            { val: false, label: 'Tidak Bersedia' }
                          ].map(opt => (
                            <button
                              key={opt.label}
                              onClick={() => setData({ ...data, willingToIva: opt.val })}
                              className={`flex-1 p-6 rounded-2xl font-bold border-2 transition-all ${data.willingToIva === opt.val ? 'border-primary bg-secondary text-primary' : 'border-border text-text-light'
                                }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-secondary p-6 rounded-2xl border border-primary/10 mt-8">
                        <p className="text-sm text-text-main leading-relaxed">
                          <span className="font-bold text-primary">Catatan:</span> Pemeriksaan IVA adalah langkah penting untuk deteksi dini. Keputusan Anda sangat berarti bagi kesehatan Anda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10 bg-secondary/30 border-t border-border flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl font-bold border border-border bg-white text-text-light hover:bg-secondary/30 transition-all flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      (screeningStep === 0 && (!data.name || !data.age || !data.maritalStatus || !data.phone || !data.address)) ||
                      (screeningStep === 1 && (data.sexuallyActive === null || (data.sexuallyActive && (data.earlySexualActivity === null || data.multiplePartners === null)))) ||
                      (screeningStep === 2 && (data.multipara === null || data.earlyFirstBirth === null || data.hormonalContraception === null || data.smokingExposure === null || data.hivStatus === null)) ||
                      (screeningStep === 3 && data.symptoms.length === 0) ||
                      (screeningStep === 4 && !data.lastTest) ||
                      (screeningStep === 5 && data.willingToIva === null)
                    }
                    className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-primary/10"
                  >
                    {screeningStep === 5 ? 'Lihat Hasil' : 'Lanjutkan'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-secondary rounded-2xl p-6 border border-primary/10">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Mengapa Skrining?</h3>
                  <p className="text-sm text-text-main leading-relaxed">
                    Kanker serviks adalah jenis kanker yang paling bisa dicegah jika dideteksi dini melalui tes IVA atau Pap Smear berkala.
                  </p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Persiapan IVA Test</h3>
                  <ul className="text-xs text-text-main space-y-2">
                    <li>• Tidak sedang menstruasi</li>
                    <li>• Tidak berhubungan seksual 24 jam terakhir</li>
                    <li>• Tidak menggunakan pembersih vagina</li>
                  </ul>
                </div>
              </aside>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid md:grid-cols-[1fr_320px] gap-8 items-start"
            >
              <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden">
                <div className={`p-10 text-center space-y-6 ${risk === 'symptoms' ? 'bg-rose-50' :
                  risk === 'active' ? 'bg-amber-50' :
                    'bg-emerald-50'
                  }`}>
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ${risk === 'symptoms' ? 'bg-accent' :
                    risk === 'active' ? 'bg-amber-500' :
                      'bg-success'
                    }`}>
                    {risk === 'symptoms' ? <AlertCircle className="text-white w-10 h-10" /> :
                      risk === 'active' ? <Info className="text-white w-10 h-10" /> :
                        <CheckCircle2 className="text-white w-10 h-10" />}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-primary max-w-3xl mx-auto leading-tight">
                      {risk === 'symptoms' ? 'PERIKSA IVA SEGERA - Perhatian Khusus Diperlukan' :
                        risk === 'active' ? 'Waktunya Pemeriksaan IVA' :
                          'Status Kesehatan Organ Reproduksi Anda Tergolong Sehat'}
                    </h2>
                    <p className="text-text-main max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                      {risk === 'symptoms' ? 'Berdasarkan gejala yang Anda alami, kami sangat menyarankan untuk segera melakukan pemeriksaan IVA dan berkonsultasi dengan tenaga medis.' :
                        risk === 'active' ? 'Tetap jaga kesehatan Reproduksi Anda dan lakukan Pemeriksaan Rutin IVA 3 tahun sekali.' :
                          'Tetap jaga kesehatan reproduksi Anda dan Lakukan pemeriksaan rutin sesuai anjuran.'}
                    </p>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-primary flex items-center gap-2 uppercase text-xs tracking-widest">
                        <Stethoscope className="w-4 h-4" />
                        Rekomendasi Tindakan
                      </h4>
                      <ul className="space-y-3 text-text-main text-sm">
                        {risk === 'symptoms' ? (
                          <>
                            <li className="flex gap-2">• Segera kunjungi Puskesmas Pakuan Baru atau dokter terdekat.</li>
                            <li className="flex gap-2">• Sampaikan keluhan Anda kepada tenaga medis.</li>
                            <li className="flex gap-2">• Jangan menunda pemeriksaan untuk deteksi dini.</li>
                          </>
                        ) : risk === 'active' ? (
                          <>
                            <li className="flex gap-2">• Jadwalkan tes IVA di Puskesmas Pakuan Baru.</li>
                            <li className="flex gap-2">• Tes IVA hanya memakan waktu 5-10 menit.</li>
                            <li className="flex gap-2">• Lakukan tes ini 3 tahun sekali.</li>
                          </>
                        ) : (
                          <>
                            <li className="flex gap-2">• Lakukan pemeriksaan rutin pada fasilitas kesehatan seperti Puskesmas Pakuan Baru jika dianjurkan.</li>
                            <li className="flex gap-2">• Jaga pola hidup sehat.</li>
                            <li className="flex gap-2">• Dapatkan vaksinasi HPV bila memungkinkan.</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-primary flex items-center gap-2 uppercase text-xs tracking-widest">
                        <MapPin className="w-4 h-4" />
                        Lokasi Pemeriksaan
                      </h4>
                      <p className="text-sm text-text-main">
                        Pemeriksaan IVA dapat dilakukan di fasilitas kesehatan tingkat pertama:
                      </p>
                      <div className="space-y-2">
                        <div className="p-3 bg-secondary rounded-xl text-xs font-bold text-primary">Puskesmas Pakuan Baru</div>
                        <div className="p-3 bg-secondary rounded-xl text-xs font-bold text-primary">Klinik Pratama Terdekat</div>
                        <div className="p-3 bg-secondary rounded-xl text-xs font-bold text-primary">Bidan Praktik Mandiri</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setStep('landing')}
                      className="px-8 py-3 rounded-xl font-bold border border-border bg-white text-text-main hover:bg-secondary transition-all"
                    >
                      Kembali ke Beranda
                    </button>
                    <button
                      onClick={() => setStep('education')}
                      className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-md shadow-primary/10"
                    >
                      Pelajari Lebih Lanjut
                    </button>
                  </div>
                </div>
              </div>

              <aside className="clinic-locator bg-white rounded-2xl border border-border p-6 flex flex-col min-h-[400px]">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Lokasi IVA Anda</h3>
                <p className="text-xs text-text-light mb-4">
                  Kunjungi fasilitas kesehatan berikut untuk melakukan pemeriksaan IVA:
                </p>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 text-text-main text-sm space-y-3 shadow-inner">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <strong className="text-primary text-base">Puskesmas Pakuan Baru</strong>
                  <p className="text-text-light text-xs leading-relaxed">
                    Jl. Jendral Sudirman No. 75<br/>
                    Kel. Tambak Sari, Kota Jambi<br/><br/>
                    <strong>Telp. (0741) 7554477</strong>
                  </p>
                </div>
              </aside>
            </motion.div>
          )}

          {step === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl font-bold text-primary">Edukasi Kanker Serviks & IVA</h2>
                <p className="text-lg text-text-light">Pahami pentingnya deteksi dini untuk masa depan yang lebih sehat.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Apa itu Kanker Serviks?',
                    desc: 'Kanker yang tumbuh pada sel-sel di leher rahim. Umumnya disebabkan oleh infeksi menular seksual virus HPV.',
                    icon: <Activity className="text-primary" />
                  },
                  {
                    title: 'Apa itu Tes IVA?',
                    desc: 'Inspeksi Visual Asam Asetat. Cara sederhana mendeteksi kanker serviks sedini mungkin dengan mengoleskan asam asetat.',
                    icon: <Stethoscope className="text-primary" />
                  },
                  {
                    title: 'Mengapa Harus IVA?',
                    desc: 'Hasilnya langsung diketahui, biaya sangat terjangkau, dan tersedia di hampir seluruh Puskesmas di Indonesia.',
                    icon: <ShieldCheck className="text-primary" />
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-border space-y-4">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-primary">{item.title}</h3>
                    <p className="text-text-main text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary text-white p-10 md:p-16 rounded-2xl overflow-hidden relative shadow-2xl shadow-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold">Siapa yang Perlu Tes IVA?</h3>
                    <ul className="space-y-4 text-secondary/80">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-accent shrink-0 mt-1" />
                        Wanita usia 30-50 tahun.
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-accent shrink-0 mt-1" />
                        Sudah pernah melakukan hubungan seksual.
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-accent shrink-0 mt-1" />
                        Tidak sedang dalam kondisi hamil.
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-accent shrink-0 mt-1" />
                        Tidak sedang dalam masa menstruasi.
                      </li>
                    </ul>
                    <button
                      onClick={startScreening}
                      className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-secondary transition-all inline-block shadow-lg"
                    >
                      Cek Risiko Saya Sekarang
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src="https://picsum.photos/seed/doctor/600/400"
                      className="rounded-2xl shadow-2xl border border-white/10"
                      alt="Doctor"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 mt-20">
        <div className="max-w-[1200px] mx-auto px-10 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <PuskesmasLogo className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-primary">SIPAKAR</span>
          </div>
          <p className="text-text-light text-sm max-w-md mx-auto">
            Aplikasi ini hanya bersifat skrining awal dan edukasi. Hasil skrining bukan merupakan diagnosis medis final.
          </p>
          <div className="text-text-light text-xs">
            © 2026 - Skrining IVA Mandiri. Dibuat untuk kesehatan wanita Indonesia.<br />
            <span className="mt-2 block font-medium">Developed by dr. Zafira Nadwa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
