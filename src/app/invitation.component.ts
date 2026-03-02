import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { NgZone } from "@angular/core";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./invitation.component.html",
  styleUrl: "./invitation.component.css",
  imports: [CommonModule, FormsModule],
})
export class InvitationComponent {
  countdown: string | undefined;
  rsvp = {
    name: "",
    attendance: "",
    pax: "",
    message: "",
  };
  isSubmitting = false;
  showSuccess = false;
  showError = false;
  lastSubmittedName = "";

  showCopySuccess = false;
  isPlaying = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.setupCountdown();
  }

  ngAfterViewInit() {
    const audio = document.getElementById("weddingSong") as HTMLAudioElement;

    audio.volume = 0.3;

    const startMusic = () => {
      audio
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(() => {
          this.isPlaying = false;
        });
    };

    // iPhone needs touchstart
    document.addEventListener("touchstart", startMusic, { once: true });

    // desktop fallback
    document.addEventListener("click", startMusic, { once: true });
  }

  toggleMusic() {
    const audio = document.getElementById("weddingSong") as HTMLAudioElement;
    if (audio.paused) {
      audio.play();
      this.isPlaying = true;
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  onSubmit(form: NgForm) {
    this.showError = false;

    // Check required fields
    if (!this.rsvp.name || !this.rsvp.attendance) {
      this.showError = true;
      setTimeout(() => (this.showError = false), 3000);
      return;
    }

    // If valid, do the real submit
    this.submitRSVP();
  }

  setupCountdown() {
    // Set the date we're counting down to
    var countDownDate = new Date("Jan 1, 2026 00:00:00").getTime();

    // Update the count down every 1 second
    var x = setInterval(() => {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.countdown = "EXPIRED";
      }
    }, 1000);
  }

  copyBankAccount() {
    const accNo = "7614843726";

    // Copy the text inside the text field
    navigator.clipboard.writeText(accNo);

    this.showCopySuccess = true;

    // Hide message after 5 seconds
    setTimeout(() => {
      this.showCopySuccess = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  async submitRSVP() {
    if (this.isSubmitting) return;

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxVyOXCsZ6iogvkJDMyXdM9FTf__hQobLicdwnEx0eifB7lpKazUAr8vAvMIaXwufQ/exec";

    const formData = new FormData();
    formData.append("Name", this.rsvp.name);
    formData.append("Attendance", this.rsvp.attendance);
    formData.append("Message", this.rsvp.message);
    formData.append("Pax", this.rsvp.pax);

    this.isSubmitting = true;
    this.showSuccess = false;

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      });
      const text = await response.text();     

      if (response.ok) {
        console.log("Response:", response, text);
        this.lastSubmittedName = this.rsvp.name;
        this.showSuccess = true;
        this.rsvp = { name: "", attendance: "", message: "", pax: "" };
        this.isSubmitting = false;
        setTimeout(() => {
          this.showSuccess = false;
          this.cdr.detectChanges();
        }, 4000);
      } else {
        console.error("Google script returned error:", response);
        alert("Something went wrong. Please try again.");
      }
    } catch (e: any) {
      console.error("Error!", e.message);
      alert("Something went wrong. Please try again.");
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  isFullscreen = false;
  fullImageSrc = "";

  openFullscreen(src: string) {
    this.fullImageSrc = src;
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
  }
}
