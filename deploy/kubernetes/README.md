## Build and Deploy Instructions

```
minikube delete
minikube config set memory 6144
minikube start
```

```
kubectl create -f deploy/kubernetes/namespace
kubectl create -f deploy/kubernetes/configmap
kubectl create -f deploy/kubernetes/manifests
```

```
kubectl delete -f deploy/kubernetes/namespace
kubectl delete -f deploy/kubernetes/configmap
kubectl delete -f deploy/kubernetes/manifests
```

```
kubectl get pods --namespace="kuruvi"
kubectl get services --namespace="kuruvi"
```

```
kubectl port-forward svc/front-end 8079:8079 --namespace='kuruvi'
```