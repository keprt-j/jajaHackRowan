import cv2
import numpy as np
import matplotlib.pyplot as plt

def process_image(image_path):

  image = cv2.imread(image_path)
  image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)


  gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

  edges = cv2.Canny(gray, 30, 100)

  # Find contours based on edges
  contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

  # Identify bounding boxes around irregular areas
  regions = []
  for cnt in contours:
      x, y, w, h = cv2.boundingRect(cnt)
      if w > 20 and h > 20:  # Filter out small noise regions
          regions.append((x, y, w, h))


  image_with_boxes = image_rgb.copy()
  for (x, y, w, h) in regions:
      cv2.rectangle(image_with_boxes, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Red boxes

 # plt.figure(figsize=(5, 5))
  #plt.imshow(image_with_boxes)
  #plt.axis("off")
  #plt.show()

  # Output the detected regions
  return (regions, image_with_boxes)
