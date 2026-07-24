import React from 'react';

const LogSheet = ({ 
  day, 
  locations, 
  isDarkTheme = false,
  truckNumber = "TK-902", 
  carrierName = "Spotter Logistics LLC", 
  mainOffice = "100 River Road, Chicago, IL", 
  homeTerminal = "100 River Road, Chicago, IL" 
}) => {
  const gridWidth = 590;
  const gridHeight = 120;
  const startX = 150;
  const startY = 30;
  
  // Theme color mapping
  const textColor = isDarkTheme ? '#94a3b8' : '#000000';
  const textBoldColor = isDarkTheme ? '#f8fafc' : '#000000';
  const gridLineColor = isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : '#cccccc';
  const gridBorderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : '#000000';
  const blueLabelColor = isDarkTheme ? '#38bdf8' : '#0000bb';
  const sumBoxFill = isDarkTheme ? '#1e293b' : '#eeeeff';
  const redLineColor = isDarkTheme ? '#ff2a5f' : '#ff0000';
  
  const tickColorHourly = isDarkTheme ? '#94a3b8' : '#000000';
  const tickColorHalf = isDarkTheme ? '#64748b' : '#444444';
  const tickColorQuarter = isDarkTheme ? '#334155' : '#888888';
  
  const rectFill1 = isDarkTheme ? '#0b0f19' : '#fdfdfd';
  const rectFill2 = isDarkTheme ? '#131929' : '#f7f7f7';

  // Helper to map minutes to X coordinate
  const getX = (min) => startX + (min / 1440.0) * gridWidth;
  
  // Helper to map status to Y coordinate
  const getY = (status) => {
    switch(status) {
      case 'OFF': return startY + 15;  // Row 1 mid (Off Duty)
      case 'SB':  return startY + 45;  // Row 2 mid (Sleeper Berth)
      case 'D':   return startY + 75;  // Row 3 mid (Driving)
      case 'ON':  return startY + 105; // Row 4 mid (On Duty Not Driving)
      default:    return startY + 15;
    }
  };

  // Generate ticks for the grid
  const renderTicks = () => {
    const ticks = [];
    // 96 quarter-hours in a day
    for (let t = 0; t <= 96; t++) {
      const x = startX + (t / 96.0) * gridWidth;
      let tickHeight = 6;
      let strokeWidth = 0.5;
      let strokeColor = tickColorQuarter;
      
      if (t % 4 === 0) { // Hourly tick
        tickHeight = 15;
        strokeWidth = 1.0;
        strokeColor = tickColorHourly;
      } else if (t % 2 === 0) { // Half-hour tick
        tickHeight = 10;
        strokeWidth = 0.7;
        strokeColor = tickColorHalf;
      }
      
      // Draw ticks across each of the 4 rows
      for (let r = 0; r < 4; r++) {
        const rowY = startY + r * 30;
        ticks.push(
          <line
            key={`tick-${t}-${r}`}
            x1={x}
            y1={rowY}
            x2={x}
            y2={rowY + tickHeight}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
        ticks.push(
          <line
            key={`tick-bot-${t}-${r}`}
            x1={x}
            y1={rowY + 30}
            x2={x}
            y2={rowY + 30 - tickHeight}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );
      }
    }
    return ticks;
  };

  // Render hour numbers above the grid
  const renderHours = () => {
    const hours = [];
    for (let h = 0; h <= 24; h++) {
      const x = startX + (h / 24.0) * gridWidth;
      let label = h;
      if (h === 0) label = "Mdt";
      if (h === 12) label = "Noon";
      if (h === 24) label = "Mdt";
      
      hours.push(
        <text
          key={`hour-${h}`}
          x={x}
          y={startY - 8}
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill={textBoldColor}
        >
          {label}
        </text>
      );
    }
    return hours;
  };

  // Build the red path for the HOS events
  const renderPath = () => {
    if (!day || !day.events || day.events.length === 0) return null;
    
    const paths = [];
    let prevY = null;
    
    day.events.forEach((ev, idx) => {
      const x1 = getX(ev.start_minute);
      const x2 = getX(ev.end_minute);
      const y = getY(ev.status);
      
      // Vertical transition line from previous status
      if (idx > 0 && prevY !== null && prevY !== y) {
        paths.push(
          <line
            key={`vert-${idx}`}
            x1={x1}
            y1={prevY}
            x2={x1}
            y2={y}
            stroke={redLineColor}
            strokeWidth="3.0"
            strokeLinecap="round"
            style={isDarkTheme ? { filter: 'drop-shadow(0 0 3px rgba(255, 42, 95, 0.6))' } : {}}
          />
        );
      }
      
      // Horizontal status line
      paths.push(
        <line
          key={`horiz-${idx}`}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={redLineColor}
          strokeWidth="3.0"
          strokeLinecap="round"
          style={isDarkTheme ? { filter: 'drop-shadow(0 0 3px rgba(255, 42, 95, 0.6))' } : {}}
        />
      );
      
      prevY = y;
    });
    
    return paths;
  };

  // Summarize miles driving today
  const milesDrivingToday = (day.summary.driving * 55).toFixed(0);

  return (
    <div className={`paper-log-sheet ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Meta Headers */}
      <div className="log-meta-grid">
        <div className="log-meta-item">
          Date: <span>{day.date_formatted}</span>
        </div>
        <div className="log-meta-item">
          From: <span>{locations.current.name.split(',')[0]}</span>
        </div>
        <div className="log-meta-item">
          To: <span>{locations.dropoff.name.split(',')[0]}</span>
        </div>
        <div className="log-meta-item">
          Truck / Trailer No: <span>{truckNumber}</span>
        </div>
        <div className="log-meta-item">
          Carrier: <span>{carrierName}</span>
        </div>
        <div className="log-meta-item">
          Home Terminal: <span>{homeTerminal}</span>
        </div>
      </div>
      
      {/* Mileage display */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '11px', fontWeight: 'bold' }}>
        <div style={{ 
          border: isDarkTheme ? '1px solid rgba(255,255,255,0.08)' : '1px solid #000000', 
          padding: '8px 16px', 
          background: isDarkTheme ? '#1e293b' : '#f5f5f5',
          borderRadius: '6px'
        }}>
          Total Miles Driving Today: <span style={{ color: blueLabelColor, fontSize: '13px' }}>{milesDrivingToday} mi</span>
        </div>
        <div style={{ 
          border: isDarkTheme ? '1px solid rgba(255,255,255,0.08)' : '1px solid #000000', 
          padding: '8px 16px', 
          background: isDarkTheme ? '#1e293b' : '#f5f5f5', 
          flex: 1,
          borderRadius: '6px'
        }}>
          Shipping Documents (Manifest): <span style={{ color: blueLabelColor, fontSize: '12px' }}>DVL-OSM-{day.date.replace(/-/g, '')}</span>
        </div>
      </div>
      
      {/* 24h Grid Graph */}
      <div className="log-grid-container">
        <svg className="log-sheet-svg" width="810" height="175">
          {/* Header Hour Numbers */}
          {renderHours()}
          
          {/* Background Row Rectangles */}
          <rect x={startX} y={startY} width={gridWidth} height="30" fill={rectFill1} stroke={gridLineColor} strokeWidth="0.5" />
          <rect x={startX} y={startY + 30} width={gridWidth} height="30" fill={rectFill2} stroke={gridLineColor} strokeWidth="0.5" />
          <rect x={startX} y={startY + 60} width={gridWidth} height="30" fill={rectFill1} stroke={gridLineColor} strokeWidth="0.5" />
          <rect x={startX} y={startY + 90} width={gridWidth} height="30" fill={rectFill2} stroke={gridLineColor} strokeWidth="0.5" />
          
          {/* Grid Borders & Horizontal dividers */}
          <line x1={startX} y1={startY} x2={startX + gridWidth} y2={startY} stroke={gridBorderColor} strokeWidth="1.5" />
          <line x1={startX} y1={startY + 30} x2={startX + gridWidth} y2={startY + 30} stroke={gridLineColor} strokeWidth="1.0" />
          <line x1={startX} y1={startY + 60} x2={startX + gridWidth} y2={startY + 60} stroke={gridLineColor} strokeWidth="1.0" />
          <line x1={startX} y1={startY + 90} x2={startX + gridWidth} y2={startY + 90} stroke={gridLineColor} strokeWidth="1.0" />
          <line x1={startX} y1={startY + 120} x2={startX + gridWidth} y2={startY + 120} stroke={gridBorderColor} strokeWidth="1.5" />
          <line x1={startX} y1={startY} x2={startX} y2={startY + 120} stroke={gridBorderColor} strokeWidth="1.5" />
          <line x1={startX + gridWidth} y1={startY} x2={startX + gridWidth} y2={startY + 120} stroke={gridBorderColor} strokeWidth="1.5" />
          
          {/* Ticks */}
          {renderTicks()}
          
          {/* Row Labels on Left */}
          <text x={startX - 10} y={startY + 20} textAnchor="end" fontSize="10" fontWeight="bold" fill={textBoldColor}>1. Off Duty</text>
          <text x={startX - 10} y={startY + 50} textAnchor="end" fontSize="10" fontWeight="bold" fill={textBoldColor}>2. Sleeper Berth</text>
          <text x={startX - 10} y={startY + 80} textAnchor="end" fontSize="10" fontWeight="bold" fill={textBoldColor}>3. Driving</text>
          <text x={startX - 10} y={startY + 110} textAnchor="end" fontSize="10" fontWeight="bold" fill={textBoldColor}>4. On Duty (not driving)</text>
          
          {/* Total Column Headers on Right */}
          <text x={startX + gridWidth + 30} y={startY - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill={textBoldColor}>Totals</text>
          
          {/* Row Total Hours display */}
          <text x={startX + gridWidth + 30} y={startY + 20} textAnchor="middle" fontSize="11" fontWeight="bold" fill={blueLabelColor}>{day.summary.off_duty.toFixed(1)}</text>
          <text x={startX + gridWidth + 30} y={startY + 50} textAnchor="middle" fontSize="11" fontWeight="bold" fill={blueLabelColor}>{day.summary.sleeper_berth.toFixed(1)}</text>
          <text x={startX + gridWidth + 30} y={startY + 80} textAnchor="middle" fontSize="11" fontWeight="bold" fill={blueLabelColor}>{day.summary.driving.toFixed(1)}</text>
          <text x={startX + gridWidth + 30} y={startY + 110} textAnchor="middle" fontSize="11" fontWeight="bold" fill={blueLabelColor}>{day.summary.on_duty.toFixed(1)}</text>
          
          {/* Total sum box */}
          <rect x={startX + gridWidth + 10} y={startY + 125} width="40" height="18" fill={sumBoxFill} stroke={gridBorderColor} />
          <text x={startX + gridWidth + 30} y={startY + 138} textAnchor="middle" fontSize="10" fontWeight="bold" fill={textBoldColor}>{day.summary.total.toFixed(0)}</text>
          
          {/* Red line HOS overlay */}
          {renderPath()}
        </svg>
      </div>
      
      {/* Bottom Remarks and Recap */}
      <div className="log-bottom-grid">
        <div className="log-remarks">
          <h3>Remarks / Change of Duty Status</h3>
          <ul className="remarks-list">
            {day.remarks && day.remarks.length > 0 ? (
              day.remarks.map((rem, i) => <li key={`rem-${i}`}>{rem}</li>)
            ) : (
              <li style={{ color: textColor, fontStyle: 'italic' }}>No change of duty status occurred today.</li>
            )}
          </ul>
        </div>
        
        <div className="log-recap">
          <h3>70 Hr / 8 Day Recap</h3>
          <table className="recap-table">
            <tbody>
              <tr>
                <td>Today's On Duty (3 + 4):</td>
                <td>{day.recap.today_on_duty.toFixed(2)} hrs</td>
              </tr>
              <tr>
                <td>(A) Total On Duty Last 7 Days:</td>
                <td>{day.recap.total_7_days.toFixed(2)} hrs</td>
              </tr>
              <tr>
                <td>(B) Available Tomorrow (70 - A):</td>
                <td>{day.recap.available_tomorrow.toFixed(2)} hrs</td>
              </tr>
              <tr>
                <td>(C) Total On Duty Last 8 Days:</td>
                <td>{day.recap.total_8_days.toFixed(2)} hrs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogSheet;
