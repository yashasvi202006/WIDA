using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;

namespace WidaLauncher
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "WIDA - Smart Healthcare & Clinical Workspace Unified Launcher";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("================================================================================");
            Console.WriteLine("       WIDA SMART HEALTHCARE & CLINICAL WORKSPACE - UNIFIED SYSTEM              ");
            Console.WriteLine("                 Integrated Multi-Module Enterprise Ecosystem                   ");
            Console.WriteLine("================================================================================");
            Console.ResetColor();

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            Console.WriteLine("[INFO] Root Directory: " + baseDir);

            // 1. Start Patient Java Backend (Port 8080)
            Console.WriteLine("\n[1/3] Launching WIDA Patient Java Backend (Port 8080)...");
            string patientBackendDir = Path.Combine(baseDir, "src", "modules", "patient", "backend");
            Process patientProc = null;
            if (Directory.Exists(patientBackendDir))
            {
                ProcessStartInfo psiPatient = new ProcessStartInfo
                {
                    FileName = "java",
                    Arguments = "-cp \"bin;lib/*\" com.wida.patient.backend.PatientBackendServer",
                    WorkingDirectory = patientBackendDir,
                    UseShellExecute = true,
                    WindowStyle = ProcessWindowStyle.Minimized
                };
                try
                {
                    patientProc = Process.Start(psiPatient);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("  -> Patient Java Backend running on http://localhost:8080");
                    Console.ResetColor();
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("  -> Java backend could not be launched directly: " + ex.Message);
                    Console.ResetColor();
                }
            }

            // 2. Start Lab Diagnostic Backend (Port 8082)
            Console.WriteLine("\n[2/3] Launching WIDA Diagnostic Laboratory Backend (Port 8082)...");
            string labServerPath = Path.Combine(baseDir, "lab", "backend", "server.js");
            Process labProc = null;
            if (File.Exists(labServerPath))
            {
                ProcessStartInfo psiLab = new ProcessStartInfo
                {
                    FileName = "node",
                    Arguments = "\"" + labServerPath + "\"",
                    WorkingDirectory = baseDir,
                    UseShellExecute = true,
                    WindowStyle = ProcessWindowStyle.Minimized
                };
                try
                {
                    labProc = Process.Start(psiLab);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("  -> Lab Diagnostic REST API running on http://localhost:8082");
                    Console.ResetColor();
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("  -> Lab backend launch notice: " + ex.Message);
                    Console.ResetColor();
                }
            }

            // 3. Start Vite Frontend Server (Port 5173)
            Console.WriteLine("\n[3/3] Launching WIDA Frontend Application (Port 5173)...");
            Process viteProc = null;
            ProcessStartInfo psiVite = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = "/c npm run dev",
                WorkingDirectory = baseDir,
                UseShellExecute = true,
                WindowStyle = ProcessWindowStyle.Minimized
            };
            try
            {
                viteProc = Process.Start(psiVite);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("  -> Frontend Development Server running on http://localhost:5173");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.WriteLine("  -> Vite launch notice: " + ex.Message);
            }

            Console.WriteLine("\nWaiting for services to initialize...");
            Thread.Sleep(3000);

            // 4. Open Default Web Browser to Unified Gateway
            string appUrl = "http://localhost:5173/?login=true";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("\n[LAUNCH] Opening WIDA Healthcare Workspace in your browser: " + appUrl);
            Console.ResetColor();
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = appUrl,
                    UseShellExecute = true
                });
            }
            catch { }

            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("\n================================================================================");
            Console.WriteLine("  PORTALS INCLUDED IN UNIFIED WORKSPACE:");
            Console.WriteLine("  1. Patient Care Portal (ABDM ABHA, Medical Records, Consultations)");
            Console.WriteLine("  2. Doctor Clinical Portal (OPD Queue, E-Prescriptions, Clinical Workflows)");
            Console.WriteLine("  3. Diagnostic Laboratory (NABL ISO 15189, Accessioning, Reports, Billing)");
            Console.WriteLine("  4. Central Pharmacy (GPP, Inventory, Prescription Dispensing, Drug Safety)");
            Console.WriteLine("  5. Universal 24/7 AI Healthcare Intelligence Assistant");
            Console.WriteLine("================================================================================");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("\nPress 'Q' or Ctrl+C to stop all background services and exit...");
            Console.ResetColor();

            while (true)
            {
                var key = Console.ReadKey(true);
                if (key.Key == ConsoleKey.Q)
                {
                    break;
                }
            }

            Console.WriteLine("\nShutting down WIDA services cleanly...");
            try { if (patientProc != null && !patientProc.HasExited) patientProc.Kill(); } catch { }
            try { if (labProc != null && !labProc.HasExited) labProc.Kill(); } catch { }
            try { if (viteProc != null && !viteProc.HasExited) viteProc.Kill(); } catch { }
            Console.WriteLine("All services stopped. Thank you for using WIDA!");
        }
    }
}
