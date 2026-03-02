import { useRef } from 'react';
import { Mic, FileText, BookOpen, MessageCircle, Check, Upload } from 'lucide-react';
import { useProgram } from '../context/ProgramContext';

export function WeeklyAudioUpload({ week }) {
  const inputRef = useRef(null);
  const { getWeeklyAudio, setWeeklyAudio } = useProgram();
  const uploaded = getWeeklyAudio(week);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWeeklyAudio(week, { name: file.name, size: file.size, dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-5 clay-card">
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-5 h-5 text-amber-600" />
        <span className="font-title font-bold text-amber-800">주 1회 오디오 암송 올리기</span>
      </div>
      {uploaded ? (
        <div className="flex items-center gap-2 text-green-600 py-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">{uploaded.name} 올림 완료!</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">이번 주 암송 녹음 파일을 올려주세요.</p>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="clay-btn flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
        </>
      )}
    </div>
  );
}

export function WeeklyDiaryUpload({ week }) {
  const inputRef = useRef(null);
  const { getWeeklyDiary, setWeeklyDiary } = useProgram();
  const uploaded = getWeeklyDiary(week);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWeeklyDiary(week, { name: file.name, size: file.size, dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-5 clay-card">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-amber-600" />
        <span className="font-title font-bold text-amber-800">암송 일기 & 필사 자료 올리기</span>
      </div>
      {uploaded ? (
        <div className="flex items-center gap-2 text-green-600 py-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">{uploaded.name} 올림 완료!</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">이번 주 암송 일기나 필사 사진/파일을 올려주세요.</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="clay-btn flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
        </>
      )}
    </div>
  );
}

export function WeeklyBookReportUpload({ week }) {
  const inputRef = useRef(null);
  const { getWeeklyBookReport, setWeeklyBookReport } = useProgram();
  const uploaded = getWeeklyBookReport(week);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWeeklyBookReport(week, { name: file.name, size: file.size, dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-5 clay-card">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-amber-600" />
        <span className="font-title font-bold text-amber-800">5주차 독후감 올리기</span>
      </div>
      {uploaded ? (
        <div className="flex items-center gap-2 text-green-600 py-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">{uploaded.name} 올림 완료!</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">독후감 파일을 올려주세요.</p>
          <input ref={inputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleChange} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="clay-btn flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
        </>
      )}
    </div>
  );
}

export function WeeklyTestimonyUpload({ week }) {
  const inputRef = useRef(null);
  const { getWeeklyTestimony, setWeeklyTestimony } = useProgram();
  const uploaded = getWeeklyTestimony(week);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setWeeklyTestimony(week, { name: file.name, size: file.size, dataUrl: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-5 clay-card">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-amber-600" />
        <span className="font-title font-bold text-amber-800">6주차 간증문 올리기</span>
      </div>
      {uploaded ? (
        <div className="flex items-center gap-2 text-green-600 py-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">{uploaded.name} 올림 완료!</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">간증문 파일을 올려주세요.</p>
          <input ref={inputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleChange} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="clay-btn flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-pastel-yellow-btn to-pastel-pink-btn font-title font-semibold text-amber-800"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
        </>
      )}
    </div>
  );
}
