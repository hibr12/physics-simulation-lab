# Interactive Physics Simulation Lab

An interactive browser-based physics sandbox that demonstrates **forces and motion** using HTML, CSS, and JavaScript.  
Users can add objects, apply forces, toggle gravity, adjust friction, and observe how objects move in real time.The simulation is designed to be easy for new users: you start by pressing the Add Object button to create one or more objects on the screen. After selecting an object from the list, you can change its mass, friction, or toggle gravity to see how these settings affect its movement. You can then apply forces using the X and Y sliders or buttons, and the object will move in real time while showing its trail, velocity vector, and force direction. The Start, Pause, and Reset buttons control the simulation, letting you experiment freely and observe how different physics settings change the motion. When you finish, a summary appears at the bottom of the screen showing each object’s final position, velocity, acceleration, and distance traveled, helping you understand the results of your experiment.

---

##  Project Overview
This project simulates **Newtonian mechanics**:
- Objects respond to applied forces, gravity, and friction.
- Motion is updated frame-by-frame using acceleration, velocity, and position equations.
- Trails and vectors visualize object paths and forces.
- A summary section provides conclusions about each object after the simulation ends.

---

##  Features
- **[Add Objects](ca://s?q=Add_objects_in_physics_lab)** → Create multiple objects with random positions and colors.
- **[Adjust Properties](ca://s?q=Adjust_object_properties_in_physics_lab)** → Change mass and friction dynamically.
- **[Gravity Toggle](ca://s?q=Gravity_toggle_in_physics_lab)** → Enable or disable downward acceleration.
- **[Apply Forces](ca://s?q=Apply_forces_in_physics_lab)** → Push objects in X and Y directions.
- **[Trails & Vectors](ca://s?q=Trails_and_vectors_in_physics_lab)** → Visualize motion history and applied forces.
- **[Object Info Panel](ca://s?q=Object_info_panel_in_physics_lab)** → Displays ID, position, velocity, acceleration, and applied forces.
- **[Simulation Summary](ca://s?q=Simulation_summary_in_physics_lab)** → At the bottom of the screen, shows final conclusions for each object.

---

##  Physics Model
The simulation uses **Newton’s Second Law**:



\[
a = \frac{F}{m}
\]



- **Forces**: Applied force + gravity + drag (friction).
- **Acceleration**: Computed per axis from total force divided by mass.
- **Velocity**: Updated by acceleration over time.
- **Position**: Updated by velocity over time.
- **Collisions**: Objects bounce off canvas edges with reduced velocity.

---

##  Project Structure

---

##  Getting Started
1. Clone or download the project.
2. Open `index.html` in any modern browser.
3. Use the control panel to:
   - Start, pause, or reset the simulation.
   - Add new objects.
   - Adjust mass, friction, and gravity.
   - Apply forces to selected objects.
4. Observe motion on the canvas and check the summary at the bottom.

---

##  Responsiveness
- **Desktop** → Controls and canvas side by side, summary at bottom.
- **Tablet** → Controls stack above canvas, summary below.
- **Mobile** → Everything stacks vertically, buttons expand full width, summary stays readable at bottom.

---

##  Conclusion
This project is a **learning tool** for physics concepts like force, acceleration, velocity, and friction.  
It also demonstrates how to combine **HTML, CSS, and JavaScript** to build interactive simulations with real-time rendering.

---

##  Possible Extensions
- Add collision detection between objects.
- Show energy (kinetic/potential) graphs.
- Export simulation summary as a downloadable report.
- Extend to 3D using WebGL or Three.js.
