import React from 'react';
import { CreditCard, Cpu, Zap, CheckCircle2, ShieldCheck, Download, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Billing() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-400" />
            Suscripción y Facturación
          </h1>
          <p className="text-geo-text-muted">Gestiona tu plan de Inteligencia Artificial y dispositivos hardware</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Plan */}
        <Card className="bg-geo-gray border-geo-gray-light relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
              ACTIVO
            </span>
          </div>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Plan IA Premium
            </CardTitle>
            <CardDescription className="text-geo-text-muted">
              Suscripción mensual de Inteligencia Artificial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$15.00</span>
              <span className="text-geo-text-muted text-sm"> / mes</span>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> Inferencias locales ilimitadas (Ollama)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> Aprendizaje de rutinas 24/7
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" /> Soporte técnico prioritario
              </li>
            </ul>
            <div className="pt-4 border-t border-geo-gray-light">
              <p className="text-sm text-geo-text-muted mb-1">Próximo cargo:</p>
              <p className="text-white font-medium">15 de Agosto, 2026</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Gestionar Suscripción
            </Button>
          </CardFooter>
        </Card>

        {/* Owned Hardware */}
        <Card className="bg-geo-gray border-geo-gray-light">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-400" />
              Hardware Asociado
            </CardTitle>
            <CardDescription className="text-geo-text-muted">
              Dispositivos físicos adquiridos (Pago Único)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-geo-darker p-4 rounded-lg border border-geo-gray-light mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-medium">GeoEntry Hub v3</h4>
                  <p className="text-xs text-geo-text-muted">ID: GHUB-2938472-X</p>
                </div>
                <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                  PAGADO
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Instalado en: Casa Principal</p>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <ShieldCheck className="h-4 w-4" /> Garantía activa hasta: Enero 2027
              </div>
            </div>
            
            <Button variant="outline" className="w-full bg-transparent border-geo-gray-light text-white hover:bg-geo-gray-light">
              Comprar Hardware Adicional
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-geo-gray border-geo-gray-light lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white text-lg">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-geo-darker rounded-lg border border-geo-gray-light">
              <div className="bg-gray-800 p-2 rounded">
                <CreditCard className="h-6 w-6 text-gray-300" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-geo-text-muted">Expira 12/28</p>
              </div>
            </div>
            <Button variant="link" className="px-0 text-blue-400 mt-4 text-sm">
              Actualizar tarjeta
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-geo-gray border-geo-gray-light lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-gray-400" /> Historial de Facturación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: '15 Jul, 2026', desc: 'Plan IA Premium (Mensual)', amount: '$15.00', status: 'Pagado' },
                { date: '15 Jun, 2026', desc: 'Plan IA Premium (Mensual)', amount: '$15.00', status: 'Pagado' },
                { date: '15 May, 2026', desc: 'GeoEntry Hub v3 + Plan IA', amount: '$114.00', status: 'Pagado' },
              ].map((inv, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-geo-darker rounded-lg border border-geo-gray-light">
                  <div>
                    <p className="text-white text-sm font-medium">{inv.desc}</p>
                    <p className="text-xs text-geo-text-muted">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">{inv.amount}</span>
                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded">{inv.status}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
