import Cvss10 from './versions/cvss10.js';
import Cvss20 from './versions/cvss20.js';
import Cvss30 from './versions/cvss30.js';
import Cvss31 from './versions/cvss31.js';
import { parseCvssVector, roundUp } from './utils.js';

const cvssClasses = {
    '1.0': Cvss10,
    '2.0': Cvss20,
    '3.0': Cvss30,
    '3.1': Cvss31,
};

class Cvss {
    constructor(cvssString, cvssClass) {
        this.cvssString = cvssString;
        this.cvssMap = parseCvssVector(cvssString, cvssClass, cvssClasses);
        if (this.cvssMap) {
            this.cvssClass = cvssClass || cvssClasses[this.cvssMap.short.CVSS];
            this.obj = new this.cvssClass(this.cvssMap.long);
            this.valid = true;
        }
        else
            this.valid = false;
    }

    getImpactScore() { return this.valid ? roundUp(this.obj.getImpactScore()) : 0; }
    getExploitabilityScore() { return this.valid ? roundUp(this.obj.getExploitabilityScore()) : 0; }
    getBaseScore() { return this.valid ? roundUp(this.obj.getBaseScore()) : 0; }
    getTemporalScore() { return this.valid ? roundUp(this.obj.getTemporalScore()) : 0; }
    getEnvironmentalScore() { return this.valid ? roundUp(this.obj.getEnvironmentalScore()) : 0; }
    getRating() {
        const baseScore = this.getBaseScore();
        if (baseScore === 0) return 'None';
        else if (baseScore < 4.0) return 'Low';
        else if (baseScore < 7.0) return 'Medium';
        else if (baseScore < 9.0) return 'High';
        else return 'Critical';
    }
    getVersion() { return this.cvssMap.short.CVSS; }
    getVector() { return this.cvssMap.short; }
    getLongVector() { return this.cvssMap.long; }
    isEqual(cvss) {
        for (const [key, value] of Object.entries(cvss.getVector())) {
            if (this.cvssMap.short[key] !== value) return false;
        }
        return true;
    }
}

if (typeof window !== 'undefined') {
    window.Cvss = Cvss;
}

export default Cvss;
